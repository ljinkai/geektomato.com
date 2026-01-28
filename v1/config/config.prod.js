/**
 * 生产环境配置
 *
 * 最终生效的配置为 prod + default（前者覆盖后者）
 */
const url = require('../app/extend/url')

module.exports = app => {
    const exports = {}

    exports.logger = {
        level: 'ERROR',
        consoleLevel: 'ERROR',
        disableConsoleAfterReady: false
    }

    // exports.redis = {
    //     client: {
    //         port: 6379,
    //         host: 'xxx',
    //         password: '',
    //         db: 0
    //     }
    // }
    exports.security = {
        xframe: {
            enable: false
        },
        csrf: {
            // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
            // ignore: ctx => isInnerIp(ctx.ip),
            ignore: ['/qun/userAdd', '/qun/userLogin', '/qun/forgetUser', '/qun/config', '/qun/synchronizationUser', '/qun/roomsList']
        }
    }
    exports.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    }
    exports.backuser = {
        id: '-12506',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjotMTI1MDZ9.yKUQNs1da_Z5fKAOly5faynkps8bU-kW1r1dorxDltc'
    }
    /**
	 * API definition
	 */
    // backend api
    const apiPinnacle = 'http://xxx.com'
    const apiFMMC = 'http://xxx.com'
    exports.urls = url({apiPinnacle, apiFMMC})

    return exports
}
