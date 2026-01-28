'use strict'
const request = require('graphql-request')
const moment = require('moment')
const requestNew = require('request')
const cheerio = require('cheerio')
const indieData = require('../extend/indieData')
const Service = require('egg').Service

let updateDate = ''
let updateDateIndie = ''
let updateDateGithub = ''
let productHuntData = {
    "data": {
        "sections": {
            "edges": [
                {
                    "cursor": "MQ==",
                    "node": {
                        "id": "MS10cnVl\n",
                        "date": "2021-11-06T19:22:02-07:00",
                        "cutoffIndex": 10,
                        "postsCount": 20,
                        "extraItems": {
                            "story": null,
                            "discussion": null,
                            "__typename": "SectionExtraItems"
                        },
                        "ad": {
                            "id": "7330",
                            "__typename": "AdChannel",
                            "post": {
                                "id": "157352",
                                "slug": "trends-by-the-hustle",
                                "name": "Trends by The Hustle",
                                "updatedAt": "2021-11-07T15:35:29-08:00",
                                "commentsCount": 60,
                                "__typename": "Post",
                                "_id": "UG9zdC0xNTczNTI=",
                                "featuredAt": "2019-06-04T00:01:00-07:00",
                                "createdAt": "2019-06-04T00:01:00-07:00",
                                "disabledWhenScheduled": true,
                                "hasVoted": false,
                                "votesCount": 1316
                            },
                            "ctaText": null,
                            "dealText": null,
                            "name": "Trends by The Hustle",
                            "tagline": "We track growing startup trends and explain how to pounce",
                            "thumbnailUuid": "a5025293-68f7-40e0-a9e4-dec51a169361.gif",
                            "url": "/r/ad/7330"
                        },
                        "posts": {
                            "edges": [
                                {
                                    "node": {
                                        "id": "318643",
                                        "featuredComment": null,
                                        "__typename": "Post",
                                        "_id": "UG9zdC0zMTg2NDM=",
                                        "commentsCount": 42,
                                        "name": "SideNotion",
                                        "shortenedUrl": "/r/p/318643",
                                        "slug": "sidenotion",
                                        "tagline": "Turn Notion into your online lecture sidekick",
                                        "updatedAt": "2021-11-07T19:14:10-08:00",
                                        "pricingType": "free",
                                        "reviewsWithBodyCount": 3,
                                        "topics": {
                                            "edges": [
                                                {
                                                    "node": {
                                                        "id": "34",
                                                        "name": "Chrome Extensions",
                                                        "slug": "chrome-extensions",
                                                        "__typename": "Topic"
                                                    },
                                                    "__typename": "TopicEdge"
                                                }
                                            ],
                                            "__typename": "TopicConnection"
                                        },
                                        "featuredAt": "2021-11-06T00:00:00-07:00",
                                        "createdAt": "2021-11-06T00:00:00-07:00",
                                        "disabledWhenScheduled": true,
                                        "hasVoted": false,
                                        "votesCount": 282,
                                        "thumbnailImageUuid": "569b6497-056a-4891-bdb3-0e7790f3ad81.png",
                                        "productState": "default"
                                    },
                                    "__typename": "PostEdge"
                                },
                                {
                                    "node": {
                                        "id": "318609",
                                        "featuredComment": null,
                                        "__typename": "Post",
                                        "_id": "UG9zdC0zMTg2MDk=",
                                        "commentsCount": 13,
                                        "name": "pdf2preview",
                                        "shortenedUrl": "/r/p/318609",
                                        "slug": "pdf2preview",
                                        "tagline": "Generate a preview image for a PDF file",
                                        "updatedAt": "2021-11-07T19:20:29-08:00",
                                        "pricingType": "free",
                                        "reviewsWithBodyCount": 0,
                                        "topics": {
                                            "edges": [
                                                {
                                                    "node": {
                                                        "id": "44",
                                                        "name": "Design Tools",
                                                        "slug": "design-tools",
                                                        "__typename": "Topic"
                                                    },
                                                    "__typename": "TopicEdge"
                                                }
                                            ],
                                            "__typename": "TopicConnection"
                                        },
                                        "featuredAt": "2021-11-06T00:01:00-07:00",
                                        "createdAt": "2021-11-06T00:01:00-07:00",
                                        "disabledWhenScheduled": true,
                                        "hasVoted": false,
                                        "votesCount": 187,
                                        "thumbnailImageUuid": "b37e479a-49c6-4d39-a936-903e9eea9145.png",
                                        "productState": "default"
                                    },
                                    "__typename": "PostEdge"
                                },
                                {
                                    "node": {
                                        "id": "318627",
                                        "featuredComment": null,
                                        "__typename": "Post",
                                        "_id": "UG9zdC0zMTg2Mjc=",
                                        "commentsCount": 43,
                                        "name": "meep • meep",
                                        "shortenedUrl": "/r/p/318627",
                                        "slug": "meep-meep",
                                        "tagline": "Activity tracking widget for Instagram",
                                        "updatedAt": "2021-11-07T19:20:34-08:00",
                                        "pricingType": "free",
                                        "reviewsWithBodyCount": 0,
                                        "topics": {
                                            "edges": [
                                                {
                                                    "node": {
                                                        "id": "8",
                                                        "name": "iPhone",
                                                        "slug": "iphone",
                                                        "__typename": "Topic"
                                                    },
                                                    "__typename": "TopicEdge"
                                                }
                                            ],
                                            "__typename": "TopicConnection"
                                        },
                                        "featuredAt": "2021-11-06T00:00:00-07:00",
                                        "createdAt": "2021-11-06T00:00:00-07:00",
                                        "disabledWhenScheduled": true,
                                        "hasVoted": false,
                                        "votesCount": 198,
                                        "thumbnailImageUuid": "2da2f400-2014-499d-a380-5edc6dbe78d3.png",
                                        "productState": "default"
                                    },
                                    "__typename": "PostEdge"
                                },
                                {
                                    "node": {
                                        "id": "318467",
                                        "featuredComment": null,
                                        "__typename": "Post",
                                        "_id": "UG9zdC0zMTg0Njc=",
                                        "commentsCount": 3,
                                        "name": "DOCKCASE",
                                        "shortenedUrl": "/r/p/318467",
                                        "slug": "dockcase",
                                        "tagline": "Smart USB-C hub with visual operating system control screen",
                                        "updatedAt": "2021-11-07T18:17:48-08:00",
                                        "pricingType": "payment_required",
                                        "reviewsWithBodyCount": 0,
                                        "topics": {
                                            "edges": [
                                                {
                                                    "node": {
                                                        "id": "125",
                                                        "name": "Hardware",
                                                        "slug": "hardware",
                                                        "__typename": "Topic"
                                                    },
                                                    "__typename": "TopicEdge"
                                                }
                                            ],
                                            "__typename": "TopicConnection"
                                        },
                                        "featuredAt": "2021-11-06T00:01:00-07:00",
                                        "createdAt": "2021-11-06T00:01:00-07:00",
                                        "disabledWhenScheduled": true,
                                        "hasVoted": false,
                                        "votesCount": 140,
                                        "thumbnailImageUuid": "cbe7d7c5-c469-4ebe-85d7-ccc2a7435781.jpeg",
                                        "productState": "default"
                                    },
                                    "__typename": "PostEdge"
                                },
                                {
                                    "node": {
                                        "id": "318690",
                                        "featuredComment": null,
                                        "__typename": "Post",
                                        "_id": "UG9zdC0zMTg2OTA=",
                                        "commentsCount": 8,
                                        "name": "INDmoney",
                                        "shortenedUrl": "/r/p/318690",
                                        "slug": "indmoney",
                                        "tagline": "SuperMoneyApp to track and invest at zero commission",
                                        "updatedAt": "2021-11-07T18:17:50-08:00",
                                        "pricingType": "free",
                                        "reviewsWithBodyCount": 0,
                                        "topics": {
                                            "edges": [
                                                {
                                                    "node": {
                                                        "id": "2",
                                                        "name": "Android",
                                                        "slug": "android",
                                                        "__typename": "Topic"
                                                    },
                                                    "__typename": "TopicEdge"
                                                }
                                            ],
                                            "__typename": "TopicConnection"
                                        },
                                        "featuredAt": "2021-11-06T00:14:44-07:00",
                                        "createdAt": "2021-11-06T00:14:44-07:00",
                                        "disabledWhenScheduled": true,
                                        "hasVoted": false,
                                        "votesCount": 140,
                                        "thumbnailImageUuid": "156fc52a-785a-4436-8d45-5e1f604239bb.jpeg",
                                        "productState": "default"
                                    },
                                    "__typename": "PostEdge"
                                },
                                {
                                    "node": {
                                        "id": "318632",
                                        "featuredComment": null,
                                        "__typename": "Post",
                                        "_id": "UG9zdC0zMTg2MzI=",
                                        "commentsCount": 3,
                                        "name": "Notchtastic",
                                        "shortenedUrl": "/r/p/318632",
                                        "slug": "notchtastic",
                                        "tagline": "A camera notch for every Mac",
                                        "updatedAt": "2021-11-07T18:17:55-08:00",
                                        "pricingType": "free_options",
                                        "reviewsWithBodyCount": 0,
                                        "topics": {
                                            "edges": [
                                                {
                                                    "node": {
                                                        "id": "19",
                                                        "name": "Mac",
                                                        "slug": "mac",
                                                        "__typename": "Topic"
                                                    },
                                                    "__typename": "TopicEdge"
                                                }
                                            ],
                                            "__typename": "TopicConnection"
                                        },
                                        "featuredAt": "2021-11-06T00:01:00-07:00",
                                        "createdAt": "2021-11-06T00:01:00-07:00",
                                        "disabledWhenScheduled": true,
                                        "hasVoted": false,
                                        "votesCount": 102,
                                        "thumbnailImageUuid": "f425b8c5-2cc8-467b-abaa-e8a36004c4b4.png",
                                        "productState": "default"
                                    },
                                    "__typename": "PostEdge"
                                },
                                {
                                    "node": {
                                        "id": "318630",
                                        "featuredComment": null,
                                        "__typename": "Post",
                                        "_id": "UG9zdC0zMTg2MzA=",
                                        "commentsCount": 3,
                                        "name": "Beacon",
                                        "shortenedUrl": "/r/p/318630",
                                        "slug": "beacon-10",
                                        "tagline": "Navigation sharing made simple and easy",
                                        "updatedAt": "2021-11-07T18:17:55-08:00",
                                        "pricingType": "free",
                                        "reviewsWithBodyCount": 0,
                                        "topics": {
                                            "edges": [
                                                {
                                                    "node": {
                                                        "id": "2",
                                                        "name": "Android",
                                                        "slug": "android",
                                                        "__typename": "Topic"
                                                    },
                                                    "__typename": "TopicEdge"
                                                }
                                            ],
                                            "__typename": "TopicConnection"
                                        },
                                        "featuredAt": "2021-11-06T00:01:00-07:00",
                                        "createdAt": "2021-11-06T00:01:00-07:00",
                                        "disabledWhenScheduled": true,
                                        "hasVoted": false,
                                        "votesCount": 92,
                                        "thumbnailImageUuid": "79eab4a5-7879-4744-8b67-726532d3a218.png",
                                        "productState": "default"
                                    },
                                    "__typename": "PostEdge"
                                },
                                {
                                    "node": {
                                        "id": "318696",
                                        "featuredComment": null,
                                        "__typename": "Post",
                                        "_id": "UG9zdC0zMTg2OTY=",
                                        "commentsCount": 3,
                                        "name": "SproutyPod",
                                        "shortenedUrl": "/r/p/318696",
                                        "slug": "sproutypod",
                                        "tagline": "The coolest little microfarm for your home",
                                        "updatedAt": "2021-11-07T18:17:54-08:00",
                                        "pricingType": "payment_required",
                                        "reviewsWithBodyCount": 0,
                                        "topics": {
                                            "edges": [
                                                {
                                                    "node": {
                                                        "id": "73",
                                                        "name": "Home",
                                                        "slug": "home",
                                                        "__typename": "Topic"
                                                    },
                                                    "__typename": "TopicEdge"
                                                }
                                            ],
                                            "__typename": "TopicConnection"
                                        },
                                        "featuredAt": "2021-11-06T02:33:10-07:00",
                                        "createdAt": "2021-11-06T02:33:10-07:00",
                                        "disabledWhenScheduled": true,
                                        "hasVoted": false,
                                        "votesCount": 79,
                                        "thumbnailImageUuid": "37e4db9a-85e0-4d97-a3ef-059db6b7f9fa.jpeg",
                                        "productState": "default"
                                    },
                                    "__typename": "PostEdge"
                                },
                                {
                                    "node": {
                                        "id": "318695",
                                        "featuredComment": null,
                                        "__typename": "Post",
                                        "_id": "UG9zdC0zMTg2OTU=",
                                        "commentsCount": 3,
                                        "name": "Flookup for Google Sheets V 2.0",
                                        "shortenedUrl": "/r/p/318695",
                                        "slug": "flookup-for-google-sheets-v-2-0",
                                        "tagline": "Fuzzy match, highlight and dedupe your datasets",
                                        "updatedAt": "2021-11-07T18:17:55-08:00",
                                        "pricingType": "free_options",
                                        "reviewsWithBodyCount": 0,
                                        "topics": {
                                            "edges": [
                                                {
                                                    "node": {
                                                        "id": "46",
                                                        "name": "Productivity",
                                                        "slug": "productivity",
                                                        "__typename": "Topic"
                                                    },
                                                    "__typename": "TopicEdge"
                                                }
                                            ],
                                            "__typename": "TopicConnection"
                                        },
                                        "featuredAt": "2021-11-06T02:34:48-07:00",
                                        "createdAt": "2021-11-06T02:34:48-07:00",
                                        "disabledWhenScheduled": true,
                                        "hasVoted": false,
                                        "votesCount": 83,
                                        "thumbnailImageUuid": "996ab43f-8fc6-416e-9298-fae2714a29c6.png",
                                        "productState": "default"
                                    },
                                    "__typename": "PostEdge"
                                },
                                {
                                    "node": {
                                        "id": "318640",
                                        "featuredComment": null,
                                        "__typename": "Post",
                                        "_id": "UG9zdC0zMTg2NDA=",
                                        "commentsCount": 5,
                                        "name": "Twitter TV",
                                        "shortenedUrl": "/r/p/318640",
                                        "slug": "twitter-tv",
                                        "tagline": "Turn any Twitter account into a screen saver",
                                        "updatedAt": "2021-11-07T18:30:43-08:00",
                                        "pricingType": "free",
                                        "reviewsWithBodyCount": 0,
                                        "topics": {
                                            "edges": [
                                                {
                                                    "node": {
                                                        "id": "46",
                                                        "name": "Productivity",
                                                        "slug": "productivity",
                                                        "__typename": "Topic"
                                                    },
                                                    "__typename": "TopicEdge"
                                                }
                                            ],
                                            "__typename": "TopicConnection"
                                        },
                                        "featuredAt": "2021-11-06T00:01:00-07:00",
                                        "createdAt": "2021-11-06T00:01:00-07:00",
                                        "disabledWhenScheduled": true,
                                        "hasVoted": false,
                                        "votesCount": 72,
                                        "thumbnailImageUuid": "ba9a23f8-9887-4c44-9cd5-87464f02c11d.gif",
                                        "productState": "default"
                                    },
                                    "__typename": "PostEdge"
                                }
                            ],
                            "pageInfo": {
                                "endCursor": "MTA=",
                                "hasNextPage": false,
                                "__typename": "PageInfo"
                            },
                            "__typename": "PostConnection"
                        },
                        "__typename": "Section"
                    },
                    "__typename": "SectionEdge"
                }
            ],
            "pageInfo": {
                "endCursor": "MQ==",
                "hasNextPage": true,
                "__typename": "PageInfo"
            },
            "__typename": "SectionConnection"
        },
        "viewer": {
            "id": null,
            "hpRecommendedFeedVariant": null,
            "experimentsBuckets": [
                {
                    "name": "hp_feed_stories",
                    "variant": "control",
                    "__typename": "ExperimentBucket"
                }
            ],
            "__typename": "Viewer"
        },
        "phHomepageOgImageUrl": "https://ph-static.imgix.net/ph-logo-1.png"
    }
}
let indiehackersData = {}
let githubData = {}

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
    async productHunt() {
        const {ctx, config} = this
        // const {request} = ctx
        const {http} = request

        const now = new Date()
        const dateString = moment(now).format('YYYY-MM-DD')
        if (updateDate === dateString) {
            return productHuntData
        } else {
            const query = indieData.query
            const variables = indieData.variable
            const url = config.urls.indiemaker.producthunt
            return request.request(url, query, variables).then(data => {
                // console.log(data);
                // sections.edges[0].node.posts.edges

                // homefeed":{
                //     "kind":"POPULAR",
                //     "edges":[
                //     {
                //     "node":{
                //     "id":"POPULAR-1-103",
                //     "title":"Yesterday",
                //     "hideAfter":14,
                //     "items
                let items = data.homefeed.edges[0].node.items
                let arr = []
                for (let i = 0; i < items; i++) {
                    let item = items[i]
                    let tmp = {
                        node: item
                    }
                    arr.push(tmp)
                }
                productHuntData = {sections: {edges: [{node: {posts: {edges: arr}}}]}}
                updateDate = dateString
                return productHuntData

            })

        }
    }
    /**
     * sign new user
     */
    async indieHackers() {
        const {ctx, config} = this
        const {request} = ctx
        const {http} = request
        const now = new Date()
        const dateString = moment(now).format('YYYY-MM-DD')
        if (updateDateIndie === dateString) {
            return indiehackersData
        } else {
            const params = {
                requests: [{indexName: 'interviews_publishedAt_desc', params: 'query=&page=0&hitsPerPage=20'}]
            }
            const url = config.urls.indiemaker.indiehackers
            indiehackersData = await http.post({url, params, headers: {}})
            updateDateIndie = dateString
            return indiehackersData

        }
    }
    /**
     * sign new user
     */
    async githubServ() {
        const {ctx, config} = this
        const {request} = ctx
        const {language} = ctx.query
        const {http} = request
        const now = new Date()
        const dateString = moment(now).format('YYYY-MM-DD')
        if ((updateDateGithub === dateString) && language && (language.length > 0) && githubData[language]) {
            return githubData[language]
        } else if ((updateDateGithub === dateString) && (language === undefined) && githubData.default) {
            return githubData.default
        } else {
            const params = {}
            const lan = language ? language : ''
            const url = `${config.urls.indiemaker.github}${lan}?since=daily`
            console.log(url)
            const returnData = await http.get({url, params})
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
            githubData[key] = res
            updateDateGithub = dateString
            return githubData[key]

        }
    }
}

module.exports = LoginService
