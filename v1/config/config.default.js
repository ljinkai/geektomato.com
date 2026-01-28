const path = require('path')
const fs = require('fs')
const url = require('../app/extend/url')

module.exports = app => {
    exports.multipart = {
        mode: 'file',
        fileSize: '100mb',
        fileExtensions: ['.csv']
    }

    exports.siteFile = {
        '/favicon.ico': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/images/favicon.ico')),
        '/apple-touch-icon.png': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/images/apple-touch-icon.png')),
        '/robots.txt': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/robots.txt')),
        '/plugin/facebook.js': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/plugin/facebook.js')),
        '/plugin/jstz-1.0.4.min.js': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/plugin/jstz-1.0.4.min.js'))
    }

    exports.view = {
        cache: false
    }

    exports.vuessr = {
        layout: path.join(app.baseDir, 'app/web/view/layout.html'),
        renderOptions: {
            // 告诉 vue-server-renderer 去 app/view 查找异步 chunk 文件
            basedir: path.join(app.baseDir, 'app/view')
        }
    }
    const domainList = ['http://localhost:8080']
    exports.security = {
        domainWhiteList: domainList,
        xframe: {
            enable: false
        },
        csrf: false
    }
    exports.cors = { origin: '*', allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH' }

    // exports.redis = {
    //     client: {
    //         port: 6379,
    //         host: '172.33.0.83',
    //         password: '',
    //         db: 0
    //     }
    // }

    exports.logger = {
        consoleLevel: 'DEBUG',
        dir: path.join(app.baseDir, 'logs')
    }

    exports.static = {
        prefix: '/public/',
        dir: path.join(app.baseDir, 'public')
    }
    // cookie sign secret key
    exports.keys = 'narwhal'

    exports.middleware = [
        'locals',
        'access',
        'device'
    ]

    exports.backuser = {
        id: '-12506',
        token: 'xx'
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
