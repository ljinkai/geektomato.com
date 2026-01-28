const Controller = require('../core/base_controller')
const jws = require('../extend/jws')

class AccountController extends Controller {
    async index() {
        const {ctx} = this
        await ctx.render('account/reset/index.js')
    }

    /**
     * 忘记密码显示页，输入邮箱
     * @returns {Promise<void>}
     */
    async forget() {
        const {ctx} = this
        await ctx.render('account/forget/index.js')
    }
    async sendForgetUrl() {
        const {ctx} = this
        const {data} = await ctx.service.account.sendForgetUrl()
        if (data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }

    /**
     * 输入新密码重置
     * @returns {Promise<void>}
     */
    async forgetReset() {
        const {ctx} = this
        await ctx.render('account/forgetReset/index.js')
    }
    async forgetResetDo() {
        const {ctx} = this
        const params = ctx.request.body
        const payload = await jws.verify(params.token)
        ctx.request.body.username = payload.payload.username
        const dateTime = new Date()
        const expNow = dateTime.getTime() / 1000
        if (expNow > payload.exp) {
            this.invalid('expired token')
        } else {
            const {data} = await ctx.service.account.reset()
            if (data.err) {
                this.invalid(data.err)
            } else {
                this.success(data)
            }
        }
    }

    /**
     * 登录后的修改密码
     * @returns {Promise<void>}
     */
    async reset() {
        const {ctx} = this
        const {data} = await ctx.service.account.reset()
        if (data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
}

module.exports = AccountController
