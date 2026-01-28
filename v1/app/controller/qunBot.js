/**
 * User login, register
 */
const Controller = require('../core/base_controller')
const jws = require('../extend/jws')


class QunBotController extends Controller {
    /**
     * 获取二维码和状态
     */
    async getQrcode() {
        const {ctx, app} = this
        const {data} = await ctx.service.qunBot.getQrcode()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
    /**
     * 获取群组列表
     */
    async getRoomList() {
        const {ctx, app} = this
        const {data} = await ctx.service.qunBot.getRoomList()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
    /**
     * 获取群成员列表
     */
    async getMemberAll() {
        const {ctx, app} = this
        const flag = await ctx.service.qunBot.isSelf()
        if (!flag) {
            this.invalid('not right user')
            return
        }
        const {data} = await ctx.service.qunBot.getMemberAll()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
    /**
     * 获取群成员列表
     */
    async checkState() {
        const {ctx, app} = this
        const {data} = await ctx.service.qunBot.checkState()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
    /**
     * 获取群成员列表
     */
    async logoutH() {
        const {ctx, app} = this
        const {data} = await ctx.service.qunBot.logout()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
    /**
     * 获取群成员列表
     */
    async restartH() {
        const {ctx, app} = this
        const {data} = await ctx.service.qunBot.restart()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
    /**
     * 获取群成员列表
     */
    async stopH() {
        const {ctx, app} = this
        const {data} = await ctx.service.qunBot.stop()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
    async logonoff() {
        const {ctx, app} = this
        const {data} = await ctx.service.qunBot.logonoff()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
}

module.exports = QunBotController
