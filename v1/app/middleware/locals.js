module.exports = () => {
    return async function locale(ctx, next) {
        ctx.locals.locale = ctx.query.locale ? ctx.query.locale.toLocaleUpperCase() : 'ZH_CN'
        ctx.locals.coinAbbr = ctx.request.header.currency ? ctx.request.header.currency : 'USD'
        await next()
    }
}
