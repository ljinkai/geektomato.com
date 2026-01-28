const uuidV4 = require('uuid')
module.exports = () => {
    return async function(ctx, next) {
        const deviceId = ctx.cookies.get('device_id', {
            signed: false,
        })
        if (!deviceId) {
            const deviceId = uuidV4.v4()
            const date = new Date()
            date.setTime(date.getTime() + 730 * 24 * 60 * 60 * 1000)
            ctx.cookies.set('device_id', encodeURIComponent(deviceId), {expires: date, signed: false, httpOnly: true})
        }
        await next()
    }
}
