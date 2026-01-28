'use strict'

const Controller = require('egg').Controller

class NotifyController extends Controller {
    async serverRun() {
        const {ctx} = this
        ctx.status = 200
        ctx.body = {
            status: 200
        }
    }
}

module.exports = NotifyController
