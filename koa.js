console.log('start')
const Koa = require('koa')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const path = require('path');
const koaBody = require('koa-body');

const app = new Koa();
app.use(koaBody({
    multipart: true
}))
app.use(bodyParser());
app.use(koaStatic(
    path.join(__dirname, './www')
))
router.get('/', async (ctx, next) => {
    ctx.body = ctx.req;
});

router.post('/uploadUrl', async (ctx, next) => {
    // console.log('index');
    // ctx.body = ctx.req;
    console.log(ctx.request.files)
});
app.use(router.routes());
app.listen(3000);