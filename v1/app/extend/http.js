'use strict'
const axios = require('axios')

module.exports = {
    get({url, params, headers}) {
        return module.exports.sendRequest({method: 'get', url, params, headers})
    },
    post({url, params, headers}) {
        return module.exports.sendRequest({method: 'post', url, data: params, headers})
    },
    patch(url, params) {
        return module.exports.sendRequest({method: 'patch', url, data: params})
    },
    put(url, params, headers) {
        return module.exports.sendRequest({method: 'put', url, data: params, headers})
    },
    delete(url, params) {
        return module.exports.sendRequest({method: 'delete', url, params})
    },
    sendRequest({method, url, params = {}, data = {}, headers = {}}) {
        return axios({
            method,
            url,
            params,
            data,
            headers
        }).then((response) => {
            return response
        }).catch(error => {
            console.log("error:", error);
            const response = error.response
            return response || {}
        })
    }
}
