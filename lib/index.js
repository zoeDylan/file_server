const http = require("http"),
  koa = require("./koa"),
  prot = process.argv[2] || 3000;
console.log(process.argv)
http
  .createServer(koa.callback())
  .listen(prot, () => {
    console.log("server run for prot:" + prot);
  })
  .once("error", e => {
    console.log(e);
  });
