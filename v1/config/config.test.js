/**
 * test环境配置
 *
 * 最终生效的配置为 test + default（前者覆盖后者）
 */

module.exports = app => {
    const exports = {}

    exports.api = 'http://xx.com'

    exports.logger = {
        level: 'DEBUG',
        consoleLevel: 'DEBUG',
        disableConsoleAfterReady: false
    }

    exports.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    }

    exports.security = {
        csrf: {
            enable: false,
        },
        domainWhiteList: ['http://xx.com']
    }

    return exports
}
