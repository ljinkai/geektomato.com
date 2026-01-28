'use strict'

const schedule = require('node-schedule')
const axios = require('axios')

const sj = async () => {
    schedule.scheduleJob('*/25 * * * *', async () => {
        console.log('scheduleJob heroku tikfeed:' + new Date())
        const method = 'get'
        const url = 'https://tikfeed.herokuapp.com/server.run'
        const params = {}
        const data = {}
        const headers = {}
        return axios({
            method,
            url,
            params,
            data,
            headers
        }).then((response) => {
            return response
        }).catch(error => {
            const response = error.response
            console.log(response)
        })
    })
}
const rollingBar = async () => {
    schedule.scheduleJob('*/27 * * * *', async () => {
        console.log('scheduleJob heroku rolling-bar:' + new Date())
        const method = 'get'
        const url = 'https://rolling-announcement-bar.herokuapp.com/server.run'
        const params = {}
        const data = {}
        const headers = {}
        return axios({
            method,
            url,
            params,
            data,
            headers
        }).then((response) => {
            return response
        }).catch(error => {
            const response = error.response
            console.log(response)
        })
    })
}
const easyTiktokPixel = async () => {
    schedule.scheduleJob('*/28 * * * *', async () => {
        console.log('scheduleJob heroku easyTiktokPixel:' + new Date())
        const method = 'get'
        const url = 'https://easy-tiktok-pixel.herokuapp.com/server.run'
        const params = {}
        const data = {}
        const headers = {}
        return axios({
            method,
            url,
            params,
            data,
            headers
        }).then((response) => {
            return response
        }).catch(error => {
            const response = error.response
            console.log(response)
        })
    })
}

// sj();
// rollingBar();
// easyTiktokPixel();
