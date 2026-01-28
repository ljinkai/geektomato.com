'use strict'

const Service = require('egg').Service

class LoginService extends Service {
    async submit() {
        const {ctx, config} = this
        const {request} = ctx
        const {email, password, modulus, imgCode, captchaId} = request.body
        const {http} = request

        const params = {
            email,
            enPassword: password,
            publicKey: modulus,
            imageCode: imgCode,
            captchaId
        }
        // use log
        return await http.post(config.urls.login.submit, params)
    }
    async facebookLogin() {
        const {ctx, config} = this
        const {request} = ctx
        const {fb_userid, fb_username, fb_headimage, fb_email, fb_token, timezone, invite_code} = request.body

        const {http} = request
        const params = {
            fb_userid,
            fb_username,
            fb_headimage,
            fb_email,
            fb_token,
            timezone,
            invite_code
        }
        const url = config.urls.login.facebookLogin
        console.log(url, JSON.stringify(params))
        return await http.post({url, params, headers: {'Content-Type': 'application/x-www-form-urlencoded', 'X-FIVEMILES-USER-ID': 'no'}})
    }
    async googleLogin() {
        const {ctx, config} = this
        const {request} = ctx
        const {gg_id, gg_display_name, gg_photo_url, gg_email, gg_id_token, gg_access_token, gg_refresh_token, timezone, invite_code} = request.body

        const {http} = request

        const params = {
            gg_id,
            gg_display_name,
            gg_photo_url,
            gg_email,
            gg_id_token,
            gg_access_token,
            gg_refresh_token,
            timezone,
            invite_code
        }
        const url = config.urls.login.googleLogin
        console.log(config.urls.login.googleLogin, JSON.stringify(params))
        return await http.post({url, params, headers: {'Content-Type': 'application/x-www-form-urlencoded', 'X-FIVEMILES-USER-ID': 'no'}})
    }
    async login() {
        const {ctx, config} = this
        const {request} = ctx
        const {http} = request

        const {email, password, response} = request.body
        const params = {
            email,
            password,
            response
        }
        const url = config.urls.login.login
        console.log(url, JSON.stringify(params))
        return await http.post({url, params, headers: {'Content-Type': 'application/x-www-form-urlencoded', 'X-FIVEMILES-USER-ID': 'no'}})
    }
    /**
     * sign new user
     */
    async signUp() {
        const {ctx, config} = this
        const {request} = ctx
        const {http} = request

        const {email, password, firstName, lastName, timezone, response} = request.body
        const params = {
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            timezone,
            response
        }
        const url = config.urls.login.signUpEmail
        console.log(url, JSON.stringify(params))
        return await http.post({url, params, headers: {'Content-Type': 'application/x-www-form-urlencoded', 'X-FIVEMILES-USER-ID': 'no'}})
    }
}

module.exports = LoginService
