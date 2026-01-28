'use strict'

const Service = require('egg').Service
const jws = require('../extend/jws')
const model = require('../extend/model')

const APP_ID = 'p7LQm0Ax5V2buo9j6FgGeH6I-gzGzoHsz'
const APP_KEY = 'DUyPQmxKCjm19wuc7TrIskab'
const AV = require('leancloud-storage')

// AV.init({
//     appId: APP_ID,
//     appKey: APP_KEY
// })

class GeekService extends Service {
    /**
     * 获取配置信息
     */
    async getList(params) {
        const {ctx, config} = this
        const {request} = ctx
        const {skip, limit} = ctx.request.query

        const query = new AV.Query('geek_items')
        // 根据用户id做更新操作
        query.addDescending('date')
        query.limit(limit || 20);// 最多返回 10 条结果
        query.skip(skip || 0);// 跳过 20 条结果
        return query.find().then(function(items) {
            const newItems = items.map((obj, key, arr) => {
                const tmp = {
                    id: obj.get('uid'),
                    title: obj.get('title'),
                    content: obj.get('content'),
                    img: obj.get('img'),
                    origin: obj.get('origin'),
                    words: obj.get('words'),
                    date: obj.get('date')
                }
                return tmp
            })
            return {data: newItems}
        }, function(error) {
        })
    }
    /**
     * 获取配置信息
     */
    async addItem(params) {
        const {ctx, config} = this
        const {request} = ctx
        const expObject = AV.Object.extend('geek_items')
        const item = new expObject()

        // 修改属性
        item.set('title', params.title)
        item.set('content', params.content)
        item.set('date', new Date(params.date))
        item.set('words', params.words)
        item.set('img', params.img)
        item.set('origin', params.origin)
        item.set('uid', Math.random().toString(36).substring(5))
        // 保存到云端
        return item.save().then(async (obj) => {
            const newItem = {
                id: obj.get('uid'),
                title: obj.get('title'),
                content: obj.get('content'),
                img: obj.get('img'),
                origin: obj.get('origin'),
                words: obj.get('words'),
                date: obj.get('date')
            }
            return {data: newItem}
        })
    }
    /**
     * 获取配置信息
     */
    async getItem(params) {
        const {ctx, config} = this
        const {request} = ctx
        const {id, title} = ctx.params

        const query = new AV.Query('geek_items')
        // 根据用户id做更新操作
        query.equalTo('uid', id)

        return query.first().then(function(obj) {
            const tmp = {
                id: obj.get('uid'),
                title: obj.get('title'),
                content: obj.get('content'),
                img: obj.get('img'),
                origin: obj.get('origin'),
                words: obj.get('words'),
                date: obj.get('date')
            }
            return {data: tmp}
        }, function(error) {
            ctx.app.logger.error(error)
            return {data: {err: error}}
        })
    }
}

module.exports = GeekService
