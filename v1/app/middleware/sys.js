module.exports = () => {
    return async function(ctx, next) {
        // development, test(ops), prod(ops) can next() access, refer to package.json 'script'
        const sysEnv = process.env.SYS_ENV
        const devFlag = process.env.NODE_ENV
        if ((devFlag && (devFlag === 'test' || devFlag === 'development')) || (sysEnv && (sysEnv === 'ops'))) {
            await next()
        } else {
            return
        }
    }
}