// ctx.request
'use strict'
const qs = require('qs')


const axios = require('axios')

module.exports = {
    /**
	 * send a get ajax request
	 * @member {String} url
	 * @param {Object} params
	 * @example
	 * ```js
	 * this.request.get
	 * => axios obj
	 * ```
	 */
    get http() {
        const ctx = this
        return {
            send: module.exports.sendRequest,
            get({url, params, headers}) {
                return module.exports.sendRequest({method: 'get', url, params, ctx, headers})
            },
            post({url, params, headers, extParams}) {
                return module.exports.sendRequest({method: 'post', url, params: extParams, data: params, ctx, headers})
            },
            patch(url, params) {
                return module.exports.sendRequest({method: 'patch', url, data: params, ctx})
            },
            put(url, params, headers) {
                return module.exports.sendRequest({method: 'put', url, data: params, ctx, headers})
            },
            delete(url, params) {
                return module.exports.sendRequest({method: 'delete', url, params, ctx})
            }
        }
    },
    /**
     * send a get ajax request
     * @member {String} url
     * @param {Object} params
     * @example
     * ```js
     * this.request.get
     * => axios sync
     * ```
     */
    sendRequest({method, url, params = {}, ctx, data = {}, headers = {}}) {
        const {header} = ctx || {}

        // get header info from cookie
        // const xHeader = getCookie(header, 'geektomato_head')
        // const deviceId = getCookie(header, 'device_id')

        // let xHeaderObj = {}
        // if (xHeader && xHeader !== 'undefined') {
        //     try {
        //         xHeaderObj = JSON.parse(decodeURIComponent(xHeader || '{}'))
        //     } catch (e) {
        //         console.log('e: ', e)
        //     }
        // } else if (!headers['X-FIVEMILES-USER-ID']) {
        //     // set default header
        //     xHeaderObj = {
        //         userId: ctx.app.config.backuser.id,
        //         userToken: ctx.app.config.backuser.token
        //     }
        // }

        // xHeaderObj = {
        //     userId: '3E8oYvQrad',
        //     userToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MDY1ODA0MjIsInVzZXJfaWQiOjE1MDd9.w-ptp7HFNdOTj4QdwYpiFmMjhFbz520VbB7eQD4Yrb8'
        // }

        // if (header['X-FIVEMILES-USER-ID'] === 'no') delete headers['X-FIVEMILES-USER-ID']

        // if (xHeaderObj.userId) headers['X-FIVEMILES-USER-ID'] = xHeaderObj.userId
        // if (xHeaderObj.userToken) headers['X-FIVEMILES-USER-TOKEN'] = xHeaderObj.userToken
        // if (header['user-agent']) headers['user-agent'] = header['user-agent']

        // if (deviceId) headers['X-FIVEMILES-DEVICE-ID'] = deviceId

        // if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        //     data = qs.stringify(data)
        // }
        return axios({
            method,
            url,
            params,
            data,
            headers
        }).then((response) => {
            // console.log('==2===', response)
            return responseAPIHandler(response)
        }).catch(error => {
            console.log("error:", error);
            const response = error.response
            ctx.app.logger.error(response && response.data)
            return response || {}
        })
    }
}

/**
 * response status and data handler
 * @param response
 * @returns {*}
 * @private
 */
function responseAPIHandler(response) {
    return response
}

function getCookie(header = {}, name) {
    // 获得客户端的Cookie
    const cookies = {}

    header.cookie && header.cookie.split(';').forEach(function(Cookie) {
        const parts = Cookie.split('=')
        cookies[parts[0].trim()] = (parts[1] || '').trim()
    })

    return decodeURIComponent(cookies[name]) || ''
}
