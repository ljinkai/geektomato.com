// const jws = require('../extend/jws')
// const ms = require('ms')
module.exports = (isBack) => {
    return async function(ctx, next) {
        const header = ctx.cookies.get('geektomato_head', {
            signed: false
        })

        if (header) {
            const {token} = JSON.parse(decodeURIComponent(header))
            if (token) {
                await next()
            } else {
                this.invalid('no header')
                return
            }
        } else {
            this.invalid('no header')
            return
        }
    }
}
