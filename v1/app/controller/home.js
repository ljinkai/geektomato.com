'use strict'

const Controller = require('../core/base_controller')

class HomeController extends Controller {
    /**
     * GET method example, render vue component
     * @returns {Promise<void>}
     */
    async index() {
        const {ctx} = this
        const {data} = await ctx.service.geek.getList()
        await ctx.render('home/home.js', {initData: data})
    }
    /**
     * 首页数据列表
     */
    async list() {
        const {ctx, app} = this
        const {data} = await ctx.service.geek.getList()
        if (data && data.err) {
            this.invalid(data.err)
        } else {
            this.success(data)
        }
    }
}

module.exports = HomeController
