const
    http = require('http'),
    koa = require('./koa'),
    prot = 3000;


http.createServer(koa.callback()).listen(prot, () => {
    console.log('server run for prot:' + prot);
}).once('error', (e) => {
    console.log(e);
});