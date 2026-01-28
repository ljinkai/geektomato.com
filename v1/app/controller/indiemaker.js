'use strict'

const Controller = require('../core/base_controller')

class IndieController extends Controller {
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
    async productHunt() {
        const {ctx, app} = this

        const data = await ctx.service.indiemaker.productHunt()
        this.ctx.body = data;
    }
    async indieHackers() {
        const {ctx, app} = this

        const data = await ctx.service.indiemaker.indieHackers();
        // this.ctx.body = data;
        const obj = data.data ? data.data.results : {};
        this.success(obj)
    }
    async github() {
        const {ctx, app} = this

        const data = await ctx.service.indiemaker.githubServ();
        // this.ctx.body = data;
        // console.log(data)
        const obj = {};// data.data ? data.data : {};
        this.success(data)
    }
    async imstartHome() {
        const {ctx, app} = this

        const data = await ctx.service.imstart.githubServ();
        // this.ctx.body = data;
        // console.log(data)
        const obj = {};// data.data ? data.data : {};
        this.success(data)
    }

    async imstartHomeData() {
        const {ctx, app} = this

        const data = await ctx.service.imstart.homeData();
        // this.ctx.body = data;
        // console.log(data)
        const obj = {};// data.data ? data.data : {};
        this.success(data)
    }
    async imstartHomePD() {
        const {ctx, app} = this

        const data = await ctx.service.imstart.productHunt();
        // this.ctx.body = data;
        // console.log(data)
        const obj = {};// data.data ? data.data : {};
        this.success(data)
    }
    async imstartHomeGithub() {
        const {ctx, app} = this

        const data = await ctx.service.imstart.githubServ();
        this.success(data)
    }
    async imstartHomeID() {
        const {ctx, app} = this
        const data = await ctx.service.imstart.indieHackers();
        this.success(data)
    }
    async imstartHomeIDCom() {
        const {ctx, app} = this
        const data = await ctx.service.imstart.indieHackersCommunity();
        this.success(data)
    }
    async v2ex() {
        const {ctx, app} = this
        const data = await ctx.service.imstart.v2ex();
        this.success(data)
    }
    async allFetch() {
        const {ctx} = this
        const data = await ctx.service.imstart.allFetch();
        this.success(data)
    }

}

module.exports = IndieController
