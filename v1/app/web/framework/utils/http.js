import axios from 'axios'
// import index from "./countdown"

/**
 * handle the API request and response: combine url、 handle the response data
 * @type {{get: (function(*, *=): *), post: (function(*, *=): *), _responseAPIHandler: (function(*=): *)}}
 */
const http = {
    /**
     * the response
     * {
    	 // `data` is the response that was provided by the server
    	 data: {},
    	 // `status` is the HTTP status code from the server response
    	 status: 200,
    	 // `statusText` is the HTTP status message from the server response
    	 statusText: 'OK',
    	 // `headers` the headers that the server responded with
    	 // All header names are lower cased
    	 headers: {},
    	 // `config` is the config that was provided to `axios` for the request
    	 config: {},
    	 // `request` is the request that generated this response
    	 // It is the last ClientRequest instance in node.js (in redirects)
    	 // and an XMLHttpRequest instance the browser
    	 request: {}
     }
     */

    get: (url, param) => {
        return axios({
            method: 'get',
            url: `${url}`,
            params: param,
            headers: {},
            // `transformResponse` allows changes to the response data to be made before
            // it is passed to then/catch
            transformResponse: [(data) => {
                // Do whatever you want to transform the data
                // console.log("===",data)
                return data
            }]
        }).then((response) => {
            return http._responseAPIHandler(response)
        })
    },
    post: (url, param) => {
        return axios({
            method: 'post',
            url,
            data: param,
            headers: {}
        })
    },
    /**
     * response status and data handler
     * @param response
     * @returns {*}
     * @private
     */
    _responseAPIHandler: (response) => {
        return response
    }
}

export default http
