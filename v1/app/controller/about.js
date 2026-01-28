'use strict'

const Controller = require('../core/base_controller')

class AboutController extends Controller {
    /**
     * GET method example, render vue component
     * @returns {Promise<void>}
     */
    async index() {
        const {ctx} = this
        await ctx.render('about/index.js', {})
    }
}

module.exports = AboutController
