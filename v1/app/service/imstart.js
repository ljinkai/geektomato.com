'use strict'
const request = require('graphql-request')
const moment = require('moment')
const requestNew = require('../extend/http')
const cheerio = require('cheerio')
const indieData = require('../extend/indieData')
const homeDB = require('../model/home_db')
const schedule = require('node-schedule')
const Service = require('egg').Service

const configUrl = {
    producthunt: 'https://www.producthunt.com/frontend/graphql',
    indiehackers: 'https://n86t1r3owz-3.algolianet.com/1/indexes/*/queries?x-algolia-application-id=N86T1R3OWZ&x-algolia-api-key=5140dac5e87f47346abbda1a34ee70c3',
    indiehackers_community: 'https://www.indiehackers.com/',
    github: 'https://github.com/trending/',
    v2ex: 'https://www.v2ex.com/api/topics/show.json'
}

class IMStartService extends Service {
    async homeData() {
        return homeDB
    }
    async productHunt() {
        return productHuntCall()
    }
    async indieHackers() {
        return indieHackers()
    }
    async indieHackersCommunity() {
        return indieHackersCommunity()
    }
    async allFetch() {
        await indieHackers()
        await indieHackersCommunity()
        await productHuntCall()
        await githubCall("javascript")
        await githubCall()
        return {}
    }
    async v2ex() {
        return await v2ex()
    }
    async githubServ() {
        const {ctx, config} = this
        const {request} = ctx
        const {language} = ctx.query
        return githubCall(language)
    }
}

async function indieHackers() {
    const now = new Date()
    var diff = moment(now).diff(moment(homeDB.indiehackers.interview.updateDate), 'seconds')
    var hour = diff/60/60

    if (homeDB.indiehackers.interview.updateDate && (diff > 0) && (hour < 6)) {
        return homeDB.indiehackers.interview.data
    } else {
        const params = {
            requests: [{indexName: 'interviews_publishedAt_desc', params: 'query=&page=0&hitsPerPage=20'}]
        }
        const url = configUrl.indiehackers
        console.log('interview url:', url)
        var res = await requestNew.post({url, params, headers: {}})
        // console.log(res)
        homeDB.indiehackers.interview.data = res.data ? res.data.results : {}
        homeDB.indiehackers.interview.updateDate = new Date()
        return homeDB.indiehackers.interview.data
    }
}
async function indieHackersCommunity() {
    const now = new Date()
    var diff = moment(now).diff(moment(homeDB.indiehackers.community.updateDate), 'seconds')
    var hour = diff/60/60

    if (homeDB.indiehackers.community.updateDate && (diff > 0) && (hour < 6)) {
        return homeDB.indiehackers.community.data
    } else {
        const params = {}
        const url = `${configUrl.indiehackers_community}`
        console.log('indieHackersCommunity:', url)
        const returnData = await requestNew.get({url, params})
        // console.log(returnData.data);
        const $ = cheerio.load(returnData.data)
        const linksDom = $('.feed-item')
        const res = []
        linksDom.each((index, item) => {
            const title = $(item).find('.feed-item__title-link').text()
                .trim()
            const href = $(item).find('.feed-item__title-link').attr('href')
            const tag = $(item).find('.group-link__name').text()
                .trim()
            const like = $(item).find('.feed-item__likes-count').text().trim()
            const replyCount = $(item).find('.reply-count__number-count').text().trim()

            const tmp = {title, href, tag, like, replyCount}
            res.push(tmp)
        })
        homeDB.indiehackers.community.data = res
        homeDB.indiehackers.community.updateDate = new Date()
        return homeDB.indiehackers.community.data
    }
}

async function v2ex() {
    const now = new Date()
    const dateString = moment(now).format('YYYY-MM-DD')
    if (homeDB.v2ex.updateDate === dateString) {
        return homeDB.v2ex.data
    } else {
        const params = {
            node_name: "create"
        }
        const url = `${configUrl.v2ex}`
        console.log(url)
        // var headers = {
        //     Host: 'www.geektomato.com'
        // }
        const returnData = await requestNew.get({url, params})
        console.log(returnData)
        const res = []
        for (var i = 0; i < returnData.length; i++) {
            var item = returnData[i]
            var title = item.title
            var href = item.url
            var title = item.title
            var created = item.created
            var temp = {title, url: href, created}
            res.push(tmp)
        }
        homeDB.v2ex.data = res
        homeDB.v2ex.updateDate = dateString
        return homeDB.v2ex.data
    }
}

async function productHuntCall() {
    const now = new Date()
    var diff = moment(now).diff(moment(homeDB.producthunt.updateDate), 'seconds')
    var hour = diff/60/60

    if (homeDB.producthunt.updateDate && (diff > 0) && (hour < 6)) {
        return homeDB.producthunt.data
    } else {
        const query = indieData.query
        const variables = indieData.variable
        const url = configUrl.producthunt
        console.log('productHuntCall url:', url)
        return request.request(url, query, variables).then(data => {
            // console.log(data);

            let items = data.homefeed.edges[0].node.items
            let arr = []
            for (let i = 0; i < items.length; i++) {
                let item = items[i]
                let tmp = {
                    node: item
                }
                arr.push(tmp)
            }
            homeDB.producthunt.data = {sections: {edges: [{node: {posts: {edges: arr}}}]}}
            homeDB.producthunt.updateDate = new Date()
            return homeDB.producthunt.data
        })
    }
}

async function githubCall(language) {
    let languageKey = language ? language : 'default'
    let initObj = homeDB.github[languageKey]

    const now = new Date()
    var diff = moment(now).diff(moment(initObj ? initObj.updateDate: ''), 'seconds')
    var hour = diff/60/60

    console.log(languageKey)
    if (initObj && (diff > 0) && (hour < 6) && languageKey && (languageKey.length > 0) && homeDB.github[languageKey].data) {
        console.log("=update=",initObj.updateDate)
        return homeDB.github[languageKey].data
    } else {
        const params = {}
        const lan = language ? language : ''
        const url = `${configUrl.github}${lan}?since=daily`
        console.log(url)
        const returnData = await requestNew.get({url, params})
        // console.log(githubData.data);
        const $ = cheerio.load(returnData.data)
        const linksDom = $('.Box-row')
        const res = []
        linksDom.each((index, item) => {
            const title = $(item).find('.h3 a').text()
                .replace(/ /g, '')
                .replace(/\n/g, '')
                .replace(/\t/g, '')
                .replace(/\r/g, '')
                .trim()
            const href = $(item).find('.h3 a').attr('href')
            const desc = $(item).find('.my-1').text()
                .trim()
            const tag = $(item).find('.ml-0').text()
                .replace(/\r/g, '')
                .trim()
            const link = $(item).find('.Link--muted').text()
                .replace(/\n/g, '')
                .trim()
            const star = link.split(' ')[0]

            const tmp = {title, href, desc, tag, star}
            res.push(tmp)
        })
        const key = language ? language : 'default'
        console.log("---",key)
        homeDB.github[key] = {}
        homeDB.github[key].data = res
        homeDB.github[key].updateDate = new Date()
        return homeDB.github[key].data
    }
}

/**
 * https://crontab.guru/
 */
const task1 = async () => {
    // schedule.scheduleJob('1 1,4,8,12,13 * * *', async () => {
    //     console.log('scheduleCronstyle:' + new Date())
    //     // await indieHackers()
    //     await indieHackersCommunity()
    //     await githubCall("javascript")
    //     await productHuntCall()
    //     await githubCall()
    // })
}

// task1()

module.exports = IMStartService
