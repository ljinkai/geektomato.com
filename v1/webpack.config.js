'use strict'
// const path = require('path')
// const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// const utils = require('../meg/config/webpack.utils.js')
//         exclude: ['.*\/component', 'app/web/page/test', 'app/web/page/account', 'app/web/page/example', 'app/web/page/home',
//             'app/web/page/order', 'app/web/page/oerder-ops', 'app/web/page/spec', 'app/web/page/spec-ops'],

module.exports = {
    egg: true,
    framework: 'vue',
    cache: true,
    compile: {
        thread: true,
        cache: true
    },
    devtool: 'source-map',
    entry: {
        include: ['app/web/page'],
        exclude: ['.*\/component'],
        loader: {
            client: 'app/web/framework/vue/entry/client-loader.js',
            server: 'app/web/framework/vue/entry/server-loader.js'
        }
    },
    alias: {
        server: 'app/web/framework/vue/entry/server.js',
        client: 'app/web/framework/vue/entry/client.js',
        asset: 'app/web/asset',
        component: 'app/web/component',
        framework: 'app/web/framework',
        vue: 'vue/dist/vue.esm.js',
        tools: 'app/web/framework/utils/tools.js',
        theme: 'app/web/theme'
    },
    extensions: ['.json', '.js', '.jsx', '.styl', '.css', '.vue'],
    dll: ['vue', 'axios'],
    loaders: {
        eslint: {
            test: /\.(js|vue|jsx)$/,
            exclude: /node_modules/,
            enforce: 'pre',
            use: [
                {
                    loader: 'eslint-loader',
                    options: {
                        formatter: require('eslint-friendly-formatter'),
                        emitWarning: true
                    }
                }
            ]
        },
        urlimage: {options: {limit: 2048}}
    },
    plugins: {
        // optimizeCSS: {
        //     name: new OptimizeCSSPlugin({
        //         cssProcessorOptions: {safe: true, map: {inline: true}}
        //     })
        // },
        // commonsChunk: {
        //     args: {
        //         name: 'vendor',
        //         minChunks: module => {
        //             // any required modules inside node_modules are extracted to vendor
        //             return (
        //                 module.resource &&
        //                 /\.js$/.test(module.resource) &&
        //                 module.resource.indexOf(
        //                     path.join(__dirname, '../node_modules')
        //                 ) === 0
        //             )
        //         }
        //     }
        // }
    },
    done() {}
}
