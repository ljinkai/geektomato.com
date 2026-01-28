const {
    Controller
} = require('egg')

// all system defined error object
const ERROR_MSG = {
    /**
     * be in common use validate error message
     */
    1000: {err_code: 1000, err_msg: 'Validate Error'}
}

class BaseController extends Controller {
    get user() {
        return this.ctx.session.user
    }

    success(data) {
        this.ctx.body = {
            success: true,
            data
        }
    }

    successString(data) {
        this.ctx.body = data
    }

    invalid(msg) {
        const extend = msg ? {err_msg: msg} : {}
        const data = Object.assign(ERROR_MSG['1000'], extend)
        this.ctx.body = {
            success: false,
            data
        }
    }

    notFound(msg) {
        msg = msg || 'not found'
        this.ctx.throw(404, new Error(msg))
    }

    file(data, config) {
        this.ctx.response.set('content-type', 'application/octet-stream;charset=utf-8');
        this.ctx.response.set('Content-Disposition', 'attachment; filename=geektomato_products.csv')
        this.ctx.body = data
    }

    error(msg) {
        return this.ctx.render('error/error.js', {msg})
    }
}

module.exports = BaseController
