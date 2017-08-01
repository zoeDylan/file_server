const
    koa = require('koa'),
    file = require('../file'),
    router = require('koa-router')(),
    send = require('koa-send'),
    koaBody = require('koa-body')(),
    static = require('koa-static'),
    sendFile = require('koa-sendfile'),
    session = require('koa-session'),
    app = new koa(),
    sessionConfig = {
        key: 'koa:session',
        /** (string) cookie key (default is koa:sess) */
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        maxAge: 86400000,
        overwrite: true,
        /** (boolean) can overwrite or not (default true) */
        httpOnly: true,
        /** (boolean) httpOnly or not (default true) */
        signed: true,
        /** (boolean) signed or not (default true) */
        rolling: false,
        /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
    };


app.keys = ['file_server'];

async function fileSend(ctx, path, root) {
    await send(ctx, path, { root: root || ctx.session.history.dir || __dirname + '/view' })
        .then(v => {
            console.log('url:', v);
        })
        .catch(e => {
            console.log('error:', e);
        });
}

//请求文件
router.get('/file', async(ctx) => {
    let
        path = ctx.request.query.path,
        dir = ctx.request.query.dir;
    !ctx.session.history && (ctx.session.history = {});
    ctx.session.history.dir = dir;
    await sendFile(ctx, path);
});

//历史记录
router.post('/history', koaBody, async(ctx) => {
    ctx.response.body = {
        status: ctx.session.history ? ctx.session.history.dir ? true : false : false,
        data: ctx.session.history
    }
});

//请求文件夹内容
router.post('/dir', koaBody, async(ctx) => {
    let path = ctx.request.body.path;
    ctx.session.history.dir = path;
    if (path) {
        await file.getDir(ctx.request.body.path)
            .then(v => {
                //存储历史访问地址
                if (ctx.session.history.savePath.indexOf(path) > -1) {
                    let index = ctx.session.history.savePath.indexOf(path);
                    ctx.session.history.savePath.splice(index, 1);
                }
                ctx.session.history.savePath.unshift(path);
                ctx.session.history.savePath.splice(10);
                ctx.response.body = {
                    status: v.status,
                    data: v.data,
                    msg: v.msg
                };
            })
            .catch(e => {
                ctx.response.body = {
                    status: false,
                    error: '路径错误，请联系管理员。'
                };
            });
    } else {
        ctx.response.body = {
            status: false,
            error: '路径错误！'
        };
    }
});

router.get('/favicon.ico', async(ctx) => {
    await fileSend(ctx, ctx.path, __dirname + '/view');
});

//首页-清除上次记录的文件夹路径 => dir
router.get('/', async(ctx) => {
    ctx.session = {
        history: Object.assign({
            dir: false,
            savePath: ctx.session.history && ctx.session.history.savePath || []
        })
    }
    await fileSend(ctx, '\index.html');
});

//其它内容
router.get('*', async(ctx) => {
    await fileSend(ctx, ctx.path == '/' ? '\index.html' : ctx.path);
});

app
    .use(session(sessionConfig, app))
    .use(router.routes())
    .use(router.allowedMethods());

module.exports = app;