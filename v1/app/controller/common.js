const Controller = require('../core/base_controller')

class CommonController extends Controller {
    async index() {
        this.success()
    }
}

module.exports = CommonController
