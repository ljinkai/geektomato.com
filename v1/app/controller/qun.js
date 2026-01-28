/**
 * User login, register
 */
const Controller = require('../core/base_controller')
const jws = require('../extend/jws')


class QunController extends Controller {
    /**
     * 注册用户
     */
    async registerUser() {
        const {ctx, app} = this
        const {data} = await ctx.service.qun.addUser()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            const header = {userId: data.get('username'), userName: data.get('nickName'), token: data.token}
            ctx.cookies.set('qunheying_header', encodeURIComponent(JSON.stringify(header)), {signed: false, httpOnly: false})
            this.success(header)
        }
    }
    /**
     * 用户登录
     */
    async loginUser() {
        const {ctx, app} = this
        const {data} = await ctx.service.qun.loginUser()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            // console.log('=====', data)
            const header = {userId: data.get('username'), userName: data.get('nickName'), token: data.token}
            // ctx.cookies.set('qunheying_header2', encodeURIComponent(JSON.stringify(header)), {signed: false, httpOnly: false})
            this.success(header)
        }
    }
    /**
     * 用忘记密码
     */
     async forgetUser() {
        const {ctx, app} = this
        const {data} = await ctx.service.qun.resetPassword()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            // console.log('=====', data)
            // ctx.cookies.set('qunheying_header2', encodeURIComponent(JSON.stringify(header)), {signed: false, httpOnly: false})
            this.success({})
        }
    }
    /**
     * 验证Token, 看是否是有效期内的会员
     */
    async synchronizationUserInfo() {
        const {ctx, app} = this
        // const {header: qunheying_header} = ctx.request.body
        const header = ctx.request.body.qunheying_header
        if (header) {
            const {token} = JSON.parse(decodeURIComponent(header))
            const result = await jws.verify(token)
            const payload = result.payload
            if (payload.userId && payload.userName) {
                const date = new Date()
                if (payload.expirationAt && (date < payload.expirationAt)) { // 会员判断过期时间，未过期则成功返回，过期则返回
                    const data = {verifed: 1, expirationAt: payload.expirationAt}
                    this.success(data)
                } else {
                    ctx.request.body.id = payload.id
                    const {data} = await ctx.service.qun.synchronizationUserInfo()
                    const userAndExpiration = data

                    if (userAndExpiration && userAndExpiration.err) {
                        this.invalid(userAndExpiration.err)
                    } else {
                        const sessionToken = payload.sessionToken
                        if (data.sessionToken !== sessionToken) { // 多用户登录
                            const data = {verifed: 3}
                            this.success(data)
                        } else {
                            const date = new Date()
                            if (userAndExpiration.expirationAt && (date < userAndExpiration.expirationAt)) { // 如果有效期内，则设定有效期token
                                // jws generate token
                                const userId = userAndExpiration.userId
                                const userName = userAndExpiration.userName
                                const expirationAt = userAndExpiration.expirationAt
                                const id = userAndExpiration.id
                                const bot = userAndExpiration.bot
                                const user = {userId, userName, expirationAt, id}
                                const token = await jws.sign(user, new Date().getTime() / 1000)
                                const data = {verifed: 1, expirationAt, userId, userName, token, bot}
                                this.success(data)
                            } else {
                                const data = {verifed: 0}
                                this.success(data)
                            }
                        }


                    }
                }
            }
        } else {
            this.invalid('no header')
        }
    }
    /**
     * 更新过期时间页面
     */
    async updateExpPage() {
        const {ctx, app} = this
        await ctx.render('updateExp/index.js', {})
    }
    /**
     * 更新过期时间
     */
    async updateExp() {
        const {ctx, app} = this
        const {data} = await ctx.service.qun.updateExp()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
    /**
     * 更新过期时间
     */
    async updatePass() {
        const {ctx, app} = this
        const {data} = await ctx.service.qun.updatePass()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
    /**
     * 获取配置信息
     */
    async configInfo() {
        const {ctx, app} = this
        const {data} = await ctx.service.qun.configInfo()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
    /**
     * 获取群列表
     */
    async roomsList() {
        const {ctx, app} = this

        const header = ctx.request.body.qunheying_header
        const right = ctx.request.body.right
        if (header) {
            const {token} = JSON.parse(decodeURIComponent(header))
            const result = await jws.verify(token)
            const payload = result.payload
            if (payload.userId && payload.userName) {
                const {bot} = JSON.parse(decodeURIComponent(right))
                if (bot == 1) { // 会员判断过期时间，未过期则成功返回，过期则返回
                    const {data} = await ctx.service.qun.roomsList(payload)
                    if (data && data.err) {
                        this.invalid(data.err)
                    } else {
                        this.success(data)
                    }
                }
            }
        } else {
            this.invalid({data: {err: 'invalide'}})
        }
    }
    /**
     * Yungouos支付回调
     */
     async yungouosHook() {
        console.log('-----Yungouosd hook-----')
        const {ctx, app} = this
        let res = ctx.request.body

        console.log("Yungouos:", res)
        let retData = ""
        if (res.code == 1) {
        //     // 如果是md2vid网站请求
        //     console.log('-----Yungouos hook succeed-----')
        //     if (res.data && res.data.plusinfo && res.data.plusinfo.s && res.data.plusinfo.s == "md2vid") {
        //         let res = await ctx.service.qun.md2vidHook()
        //         retData = res.data
            // } else
            if (res.outTradeNo && res.outTradeNo.indexOf("tabhub") > -1) {
                let res = await ctx.service.qun.tabhubHook()
                console.log('tabhubHook after ------:', res)
                retData = res
            } else {
                let ret  = await ctx.service.qun.onYungouosHook()
                retData = ret
            }
        }
        this.successString(retData)
    }
    /**
     * 面包多支付订单状态查询
     */
    async mbdQueryOrder() {
        console.log('-----mbd order query-----')
        const {ctx} = this
        let result  = await ctx.service.qun.queryMbdOrder()
        this.success(result.data)
    }
    /**
     * yungouos多支付订单状态查询
     */
     async yunQueryOrder() {
        console.log('-----yungouos order query-----')
        const {ctx} = this
        let result  = await ctx.service.qun.queryYunOrder()
        this.success(result.data)
    }
    /**
     * 订单消息通知
     */
     async notificationToWX() {
        const {ctx} = this
        let result  = await ctx.service.qun.notificationToWX()
        this.success(result.data)
    }
    /**
     * 微信支付签名
     */
     async wxPayQrcode() {
        const {ctx} = this
        let result  = await ctx.service.qun.wxPayQrcode()
        this.success(result.data)
    }
}

module.exports = QunController
