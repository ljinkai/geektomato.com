/**
 * User login, register
 */
const Controller = require('../core/base_controller')
const jws = require('../extend/jws')


class QunController extends Controller {

    async weekly() {
        const {ctx} = this
        await ctx.render('weekly/index.js', {})
    }
    /**
     * 添加页面
     */
    async addItemIndex() {
        const {ctx, app} = this
        await ctx.render('edit/index.js', {})
    }
    async viewItem(allContent) {
        const {ctx, app} = this
        const {id} = ctx.params
        const result = await ctx.service.geek.getItem()
        await ctx.render('item/index.js', {initData: result})
    }
    /**
     * 添加操作
     */
    async _addItem(allContent) {
        const {ctx, app} = this
        const item = {}
        if (allContent) {
            const con = allContent.split('> 日期：')[0]
            const ext = allContent.split('> 日期：')[1]
            // content part
            item.title = con.split('\n')[0].trim()
            item.content = con.split(item.title + '\n\n')[1].split('\n\n![](')[0]
            item.img = ''
            if (con.split('> 单词：')[0].indexOf('![](') >= 0) {
                item.img = con.split('> 单词：')[0].split('![](')[1].split(')')[0].trim()
            }
            if (ext.indexOf('> 单词：') > 0) {
                // ext part
                item.date = ext.split('> 单词：')[0].split('\n')[0].trim()
                item.words = ext.split('> 单词：')[1].split('> 原文：')[0].split('\n')[0].trim()
                item.origin = ext.split('> 单词：')[1].split('> 原文：')[1].split('\n')[0].trim()
            } else {
                // ext part
                item.date = ext.split('> 原文：')[0].split('\n')[0].trim()
                item.words = ''
                item.origin = ext.split('> 原文：')[1].split('\n')[0].trim()
            }
        }

        const title = item.title
        const content = item.content
        const words = item.words
        const img = item.img
        const origin = item.origin
        const date = item.date
        // this.success({date: item})
        return await ctx.service.geek.addItem({title, content, words, img, origin, date})
    }
    async addItem() {
        const {ctx, app} = this
        const {request} = ctx
        const item = {}
        const {allContent} = request.body
        const arr = allContent.split('# ')
        let i = 0
        await arr.forEach(async (item, key) => {
            if (item.length > 50) {
                i++
                return await this._addItem(item)
            }
        })
        if (i === (arr.length - 1)) {
            this.success({data: i})
        }
    }
}

module.exports = QunController
