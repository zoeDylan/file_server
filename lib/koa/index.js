const
    koa = require('koa'),
    file = require('../file'),
    router = require('koa-router')(),
    send = require('koa-send'),
    koaBody = require('koa-body')(),
    static = require('koa-static'),
    sendFile = require('koa-sendfile'),
    app = new koa();

async function fileSend(ctx, path, root) {
    await send(ctx, path, { root: root || __dirname + '/view' })
        .then(v => {
            console.log('url:', v);
        })
        .catch(e => {
            ctx.response.redirect('/404');
        });
}

router.get('/404', async(ctx) => {
    await fileSend(ctx, '/404.html');
});


router.get('/file', async(ctx) => {
    let
        path = ctx.request.query.path,
        dir = ctx.request.query.dir;
    await sendFile(ctx, path);
});

router.get(/\/*\.*|\//, async(ctx) => {
    await fileSend(ctx, ctx.path == '/' ? '\index.html' : ctx.path);
});

router.post('/dir', koaBody, async(ctx) => {
    let path = ctx.request.body.path;
    if (path) {
        await file.getDir(ctx.request.body.path)
            .then(v => {
                ctx.response.body = {
                    status: true,
                    data: v
                };
            })
            .catch(e => {
                console.log('getDir Error at lib/koa/index.js > post(/dir,***');
                ctx.response.body = {
                    status: false,
                    error: '服务器内部错误，请联系管理员。'
                };
            });
    } else {
        ctx.response.body = {
            status: false,
            error: '路径错误！'
        };
    }
});

router.get('*', async(ctx) => {

    await fileSend(ctx, ctx.path);
});

app
    .use(static('./view/static'))
    .use(router.routes())
    .use(router.allowedMethods());

module.exports = app;