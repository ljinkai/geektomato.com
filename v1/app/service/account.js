'use strict'

const Service = require('egg').Service
const jws = require('../extend/jws')

class AccountService extends Service {
    async reset() {
        const {ctx, config} = this
        const {http} = ctx.request
        const url = config.urls.account.reset
        const data = ctx.request.body
        const result = await http.post(url, data)
        return result
    }
    async _tokenReset(email, username) {
        const data = { email, username}
        // 一天过期
        const token = await jws.sign(data, new Date().getTime() / 1000 + 86400)
        return token
    }
    async sendForgetUrl() {
        const {ctx, config} = this
        const {http} = ctx.request
        const url = config.urls.account.forget
        const {userName, host} = ctx.request.body

        const user = await ctx.service.login.submitBoss()
        if (user.data && user.data.state === 1) {
            const {email} = user.data
            const token = await this._tokenReset(email, userName)
            const data = {
                to: email,
                from: '',
                subject: '【极客番茄】找回密码',
                text: `有人请求找回密码，您需要通过点击以下链接进行操作。<br><br><a href="${host}/account/forgetReset?t=${token}" target="_blank">点击修改密码</a><br><br>在访问上面的链接并创建新密码之前，您的密码不会更改。<br>如果您没有要求，请忽略此电子邮件。`
            }
            const result = await http.post(url, data, {'Tenant-Id': 'narwhal'})
            return result
        } else {
            return {data: {err: 'Invalid user.'}}
        }


    }
}

module.exports = AccountService
