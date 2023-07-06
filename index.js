const Koa = require("koa");
const { Transform } = require("stream");
const EventEmitter = require("events");

class SSEStream extends Transform {
    constructor() {
        super({
            writableObjectMode: true,
        });
    }

    _transform(data, _encoding, done) {
        this.push(`data: ${JSON.stringify(data)}\n\n`);
        done();
    }
}

const events = new EventEmitter();
events.setMaxListeners(0);

const interval = setInterval(() => {
    events.emit("data", { timestamp: new Date() });
}, 1000);

new Koa().
use(async (ctx, next) => {
    if (ctx.path !== "/sse") {
        return await next();
    }

    ctx.request.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);

    ctx.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin", "*"
    });

    const stream = new SSEStream();
    ctx.status = 200;
    ctx.body = stream;

    const listener = (data) => {
        stream.write(data);
    };

    events.on("data", listener);

    stream.on("close", () => {
        events.off("data", listener);
    });
})
    .use(ctx => {
        ctx.status = 200;
        ctx.body = "ok";
    })
    .listen(3080, () => console.log("Listening"));

