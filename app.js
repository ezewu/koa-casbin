const Koa = require('koa')
const Router = require('koa-router')
const casbin = require('casbin')
const koaBody = require('koa-body')

const app = new Koa()
const router = new Router()

app.use(koaBody())

app.use(async (ctx, next) => {
    console.log(`请求的url ${ctx.url}`)
    await next()
})


app.use(async (ctx,next) => {
    const newEnforcer =  async () => {
        const enforcer = await casbin.newEnforcer('examples/authz_model.conf', 'examples/authz_policy.csv')
        return enforcer
    }
    const enforcer = await newEnforcer()
    const {originalUrl: path, method} = ctx
    const username = ctx.get('Authorization')
    if( !await enforcer.enforce(username, path, method) ){
        ctx.status = 403
        return ctx.body = {
            code: '403',
            msg: '您没有权限',
            time: Date.now()
        }
    }
    await next()
})

app.use(router.routes()).use(router.allowedMethods())

// p, dataset1_admin, /dataset1/*, *
// g, cathy, dataset1_admin

router.get('/dataset1/,', async (ctx, next) => {
    // p, alice, /dataset1/*, GET
    ctx.body = {
        code: '200',
        msg: '请求成功',
        time: Date.now()
    }
})

router.post('/dataset1/resource1', async (ctx, next) => {
    // p, alice, /dataset1/resource1, POST
    ctx.body = {
        code: '200',
        msg: '请求成功',
        time: Date.now()
    }
})

router.all('/dataset2/resource1', async (ctx, next) => {
    // p, bob, /dataset2/resource1, *
    ctx.body = {
        code: '200',
        msg: '请求成功',
        time: Date.now()
    }
})

router.get('/dataset2/resource2', async (ctx, next) => {
    // p, bob, /dataset2/resource2, GET
    ctx.body = {
        code: '200',
        msg: '请求成功',
        time: Date.now()
    }
})

router.post('/dataset2/folder1', async (ctx, next) => {
    // p, bob, /dataset2/folder1/*, POST
    ctx.body = {
        code: '200',
        msg: '请求成功',
        time: Date.now()
    }
})

app.listen(3000, () => {
    console.log('listen 3000')
})