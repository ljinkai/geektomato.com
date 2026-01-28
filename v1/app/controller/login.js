/**
 * User login, register
 */
const Controller = require('../core/base_controller')
const bcrypt = require('bcrypt-nodejs')
const jws = require('../extend/jws')

class LoginController extends Controller {
    /**
	 * login index page
	 * @returns {Promise<void>}
	 */
    async index() {
        const {ctx, app} = this
        const result = await ctx.service.common.imgCaptcha()
        ctx.session.imgCode = result.text // add captcha text to session
        await ctx.render('login/index.js', {imgCaptha: result.data})
    }
    /**
	 * facebook login
	 */
    async facebookLogin() {
        const {ctx} = this
        const {data} = await ctx.service.login.facebookLogin()
        if (data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
    /**
     * google login
     */
    async googleLogin() {
        const {ctx, app} = this
        const {data} = await ctx.service.login.googleLogin()
        // await ctx.service.common.setUserToRedis(data)
        if (data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }

    /**
     * login
     */
    async login() {
        const {ctx, app} = this
        const {data} = await ctx.service.login.login()
        if (data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }

    /**
     * signUp
     */
    async signUp() {
        const {ctx, app} = this
        const {data} = await ctx.service.login.signUp()
        if (data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
}

module.exports = LoginController
