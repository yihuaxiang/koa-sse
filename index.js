const Koa = require('koa');
const app = new Koa();
const sse = require('./sse/index.js')

app.use(sse({
    maxClients: 5000,
    pingInterval: 30000
}))

app.use(async ctx => {
    ctx.sse.send('1');
    ctx.sse.send('2');
    ctx.sse.send('3');
    ctx.sse.send('4');
    ctx.sse.send('5');
    ctx.sse.send('6');
    ctx.sse.send('7');
    ctx.sse.send('8');
    ctx.sse.sendEnd();
})

app.listen(3000)
