const Koa = require('koa')
const Router = require('koa-router')
const casbin = require('casbin')
const koaBody = require('koa-body')

const app = new Koa()
const router = new Router()

app.use(koaBody())

app.use(async (ctx, next) => {
    const enforcer = await casbin.newEnforcer('examples/authz_model.conf', 'examples/authz_policy.csv')
    const { originalUrl: path, method } = ctx
    const username = ctx.get('Authorization')

    console.log(`用户: ${username} 地址: ${ctx.url} 操作: ${method}`)
    if (!await enforcer.enforce(username, path, method)) {
        ctx.status = 403
        return ctx.body = {
            code: '403',
            msg: '您没有权限',
            time: Date.now()
        }
    }
    console.log('获取用户具有的隐式角色 检索间接角色 ', await enforcer.getImplicitRolesForUser('bbbb'))
    console.log('获取用户具有的角色 不检索间接角色 ', await enforcer.getRolesForUser('bbbb'))
    console.log('获取所有用户 ', await enforcer.getAllSubjects())
    console.log('获取所有角色 ', await enforcer.getAllRoles())
    await next()
})


app.use(router.routes()).use(router.allowedMethods())


router.get('/dataset1/', async (ctx, next) => {
    ctx.body = {
        code: '200',
        msg: '请求成功',
        data: resBody(ctx),
        time: Date.now()
    }
})

router.get('/dataset1/resource1', async (ctx, next) => {
    ctx.body = {
        code: '200',
        msg: '请求成功',
        data: resBody(ctx),
        time: Date.now()
    }
})

router.get('/dataset1/resource1/resource2', async (ctx, next) => {
    ctx.body = {
        code: '200',
        msg: '请求成功',
        data: resBody(ctx),
        time: Date.now()
    }
})


router.put('/dataset1/resource2', async (ctx, next) => {
    ctx.body = {
        code: '200',
        msg: '请求成功',
        data: resBody(ctx),
        time: Date.now()
    }
})

router.delete('/dataset1/', async (ctx, next) => {
    ctx.body = {
        code: '200',
        msg: '请求成功',
        data: resBody(ctx),
        time: Date.now()
    }
})

router.delete('/dataset1/:id', async (ctx, next) => {
    ctx.body = {
        code: '200',
        msg: '请求成功',
        data: resBody(ctx),
        time: Date.now()
    }
})

router.post('/dataset1/resource1', async (ctx, next) => {
    ctx.body = {
        code: '200',
        msg: '请求成功',
        data: resBody(ctx),
        time: Date.now()
    }
})

router.all('/dataset2/resource1', async (ctx, next) => {
    ctx.body = {
        code: '200',
        msg: '请求成功',
        data: resBody(ctx),
        time: Date.now()
    }
})

router.get('/dataset2/resource2', async (ctx, next) => {
    ctx.body = {
        code: '200',
        msg: '请求成功',
        data: resBody(ctx),
        time: Date.now()
    }
})

router.post('/dataset2/folder1', async (ctx, next) => {
    ctx.body = {
        code: '200',
        msg: '请求成功',
        data: resBody(ctx),
        time: Date.now()
    }
})

const resBody = ctx => {
    const { originalUrl: path, method } = ctx
    const username = ctx.get('Authorization')
    return `用户: ${username} 地址: ${ctx.url} 操作: ${method}`
}

app.listen(3000, () => {
    console.log('listen 3000')
})