'use strict'

const Service = require('egg').Service
const jws = require('../extend/jws')
const model = require('../extend/model')
const CryptoJS = require('crypto-js')


const APP_ID = 'ksq1fOUMOKe53go0dLV3TAct-gzGzoHsz'
const APP_KEY = 'uTaalof5ql4lCYAz7JWiJMX9'
const MASTER_KEY = 'i5Jp7f6qDPece90KWu8XpV5B'
const AV = require('leancloud-storage')

const yungouosKey = "555996BFBDB54D0397663F42B8511FE0"

AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
    masterKey: MASTER_KEY,
    serverURLs: 'https://avoscloud.com',
})
AV.Cloud.useMasterKey();

class QunService extends Service {
    async test() {
        console.log('into test')
        const TestObject = AV.Object.extend('TestObject')
        const testObject = new TestObject()
        return testObject.save({
            words: 'Hello World!'
        }).then(function(object) {
            console.log('LeanCloud Rocks!' + object)
            return object
        })
    }
    /**
     * 注册一个新用户
     */
    async addUser() {
        const {ctx} = this
        const {request} = ctx
        const {http} = request

        const {userName, userId, password, email} = request.body
        const user = new AV.User()
        user.setUsername(userId) // 用户id
        user.set('nickName', userName) // 昵称
        user.set('email', email) // 邮箱
        user.set('applyAt', new Date())
        user.setPassword(password)
        // user.setEmail(email);
        return user.signUp().then(async (loginedUser) => {
            console.log(loginedUser.id)
            const user = AV.Object.createWithoutData('_User', loginedUser.id)
            // 第一个参数是 className，第二个参数是 objectId
            const expObject = AV.Object.extend('Expiration')
            const exp = new expObject()
            // 修改属性
            exp.set('username', userId)
            exp.set('userObjectId', loginedUser.id)
            exp.set('userObject', user)


            // 重置token
            const refreshObj = await this.refreshToken({id: loginedUser.id, sessionToken: loginedUser.getSessionToken()})
            const newSessionToken = refreshObj.data.sessionToken
            exp.set('sessionToken', newSessionToken)
            // 保存到云端
            return exp.save().then(async () => {
                // jws generate token
                const user = {userId, userName, id: loginedUser.id, sessionToken: newSessionToken}
                const token = await jws.sign(user, new Date().getTime() / 1000)
                loginedUser.token = token
                return {data: loginedUser}
            })

        }, function(error) {
            ctx.app.logger.error(error)
            return {data: {err: error}}
        })
    }
    /**
     * 用户登录
     */
    async loginUser() {
        const {ctx} = this
        const {request} = ctx

        const {userId, password} = request.body
        return AV.User.logIn(userId, password).then(async (loggedInUser) => {
            // 重置token
            const refreshObj = await this.refreshToken({id: loggedInUser.id, sessionToken: loggedInUser.getSessionToken()})
            const newSessionToken = refreshObj.data.sessionToken

            // 记录sessionToken到Expiration表
            const expiration = new AV.Query('Expiration')
            expiration.equalTo('username', loggedInUser.get('username'))

            return expiration.first().then(function(account) {
                const objectId = account.id
                const exp = AV.Object.createWithoutData('Expiration', objectId)
                exp.set('sessionToken', newSessionToken)
                // 保存到云端
                return exp.save().then(async (res) => {
                    const user = {userId: loggedInUser.get('username'), userName: loggedInUser.get('nickName'), id: loggedInUser.id, sessionToken: newSessionToken}
                    const token = await jws.sign(user, new Date().getTime() / 1000)
                    loggedInUser.token = token
                    return {data: loggedInUser}
                })
            })


        }, function(error) {
            ctx.app.logger.error(error)
            return {data: {err: error}}
        })
    }
    /**
     * 获取用户信息和过期时间
     */
    async synchronizationUserInfo() {
        const {ctx, config} = this
        const {request} = ctx

        const {id} = request.body
        const query = new AV.Query('Expiration')
        const linkUser = AV.Object.createWithoutData('_User', id)
        query.equalTo('userObject', linkUser)
        query.include('userObject')

        return query.find().then(function(users) {
            const user = users[0]
            const userName = user.get('userObject').get('nickName')
            const obj = {sessionToken: user.get('sessionToken'), userId: user.get('username'), userName,
                expirationAt: user.get('expirationAt'),
                id: user.get('userObjectId'),
                bot: user.get('Bot')
            }
            return {data: obj}
        }, function(error) {
        })

    }
    /**
     * 更新过期时间
     */
    async updateExp() {
        const {ctx, app} = this
        const {userName, day, password, overlay} = ctx.request.body
        const query = new AV.Query('_User')
        // 根据用户id做更新操作
        query.equalTo('username', userName)

        const days = {
            1: 24 * 60 * 60 * 1000,
            3: 3 * 24 * 60 * 60 * 1000,
            7: 7 * 24 * 60 * 60 * 1000,
            30: 30 * 24 * 60 * 60 * 1000,
            31: 31 * 24 * 60 * 60 * 1000,
            91: 91 * 24 * 60 * 60 * 1000,
            183: 183 * 24 * 60 * 60 * 1000,
            365: 365 * 24 * 60 * 60 * 1000
        }
        const updateTime = days[day]
        return query.first().then(function(results) {
            const expiration = new AV.Query('Expiration')
            expiration.equalTo('username', userName)
            return expiration.first().then(function(account) {
                const orgExporationAt = account.get('expirationAt')
                console.log('==account===', orgExporationAt)
                if (account) {
                    const objectId = account.id
                    const exp = AV.Object.createWithoutData('Expiration', objectId)
                    // 设置过期时间
                    const date = new Date()
                    let baseTime = date.getTime()
                    if (overlay) {
                        baseTime = orgExporationAt
                    }
                    date.setTime(baseTime + updateTime)
                    exp.set('expirationAt', date)
                    if (day === '365') {
                        exp.set('Bot', '1')
                    }
                    if (day === '30') {
                        exp.set('Bot', '1')
                    }
                    // 保存到云端
                    return exp.save().then((res) => {
                        return {data: res}
                    })
                } else {
                    const error = `no user ${userName}`
                    ctx.app.logger.error(error)
                    return {data: {err: error}}
                }

            })
        }, function(error) {
            ctx.app.logger.error(error)
            return {data: {err: error}}
        })
    }
    /**
     * 更新密码
     */
    async updatePass() {
        const {ctx, app, config} = this
        const {username, expirationAt} = ctx.request.body
        const {request} = ctx

        const {http} = request

        const query = new AV.Query('_User')
        // 根据用户id做更新操作
        query.equalTo('username', username)

        // return query.first().then(function(results) {
        //     console.log('=====', results)
        //     const objectId = results.id
        //     const user = AV.Object.createWithoutData('_User', objectId)
        //     // 设置过期时间
        //     user.set('password', '123')
        //     // 保存到云端
        //     return user.save().then((res) => {
        //         return {data: res}
        //     })
        // }, function(error) {
        //     ctx.app.logger.error(error)
        //     return {data: {err: error}}
        // })
        const params = {password: '123'}
        // const url = 'https://ksq1foum.api.lncld.net/1.1/users/5c6bbfa2303f3900474c2328'
        const url = 'https://avoscloud.com/1.1/users/5c6bbfa2303f3900474c2328'
        return await http.put(url, params)
    }
    /**
     * 重置token
     */
    async refreshToken(params) {
        const {ctx, app, config} = this
        const {request} = ctx
        const {http} = request

        // const url = `https://ksq1foum.api.lncld.net/1.1/users/${params.id}/refreshSessionToken`
        const url = `https://avoscloud.com/1.1/users/${params.id}/refreshSessionToken`
        const headers = {
            'X-LC-Id': APP_ID,
            'X-LC-Key': APP_KEY,
            'X-LC-Session': params.sessionToken
        }
        return await http.put(url, params, headers)
    }
    /**
     * 忘记密码
     */
     async resetPassword(params) {
        const {ctx, app, config} = this
        const {request} = ctx
        const {http} = request

        const {userId} = ctx.request.body
        const query = new AV.Query('_User')
        // 根据用户id做更新操作
        query.equalTo('username', userId)
        return query.first().then(async function(results) {

            if (results && results.get("email")) {
                let email = results.get("email")
                const url = `https://ksq1foum.lc-cn-n1-shared.com/1.1/requestPasswordReset`
                const headers = {
                    'X-LC-Id': APP_ID,
                    'X-LC-Key': APP_KEY
                }
                return await http.post({url, params: {"email": email}, headers})
            } else {
                return {data: {err: {"err_msg": "此微信ID对应的邮箱不存在,请检查或者联系客服人员重置！"}}}
            }
        }, function(error) {
            return error
        })
    }
    /**
     * 获取配置信息
     */
    async configInfo(params) {
        const {ctx, config} = this
        const {request} = ctx
        const {inner} = ctx.request.query
        if ((model.theme.length > 0) && !inner) {
            const result = {
                theme: model.theme,
                config: model.config
            }
            return {data: result}
        } else {
            const query = new AV.Query('theme')
            // 根据用户id做更新操作
            query.equalTo('state', 1)
            query.addAscending('order')
            return query.find().then(function(items) {
                const newItems = items.map((obj, key, arr) => {
                    const tmp = {
                        url: obj.get('url'),
                        vip: obj.get('vip')
                    }
                    return tmp
                })
                model.theme = newItems
                const query = new AV.Query('config')
                // 根据用户id做更新操作
                return query.find().then(function(confs) {
                    const newConfsJson = {}
                    confs.forEach((obj, key) => {
                        newConfsJson[obj.get('key')] = obj.get('value')
                    })
                    model.config = newConfsJson
                    const result = {
                        theme: model.theme,
                        config: model.config
                    }
                    return {data: result}
                }, () => {
                })
            }, function(error) {
            })
        }
    }
    /**
     * 获取配置信息
     */
    async roomsList(payload) {
        const {ctx, config} = this
        const {request} = ctx
        const {userId} = payload

        const query = new AV.Query('Rooms')
        // 根据用户id做更新操作
        query.equalTo('userId', userId)
        return query.find().then(function(items) {
            const newItems = items.map((obj, key, arr) => {
                const tmp = {
                    roomName: obj.get('roomName'),
                    memberAll: obj.get('memberAll')
                }
                return tmp
            })
            return {data: newItems}
        }, function(error) {
        })
    }
    _md5(str) {
        var encoding = arguments[1] !== (void 0) ? arguments[1] : 'utf8';
        return crypto.createHash('md5').update(str, encoding).digest('hex');
      }
    _sign(transParams, key) {
        const paramsArr = Object.keys(transParams);
        paramsArr.sort();
        const stringArr = []
        paramsArr.map(key => {
            stringArr.push(key + '=' + transParams[key]);
        })
        stringArr.push("key=" + key)
        const str = stringArr.join('&');
        console.log(str)
        let signStr = CryptoJS.MD5(str).toString().toUpperCase();
        return signStr

    }
    async onMbdHook() {
        const {ctx, config} = this
        const {request} = ctx
        const {http} = request
        const params = request.body

        let result = {}

        let tradNo = params.data.out_trade_no
        console.log('params:', params)
        if (tradNo) {
            let queryParams = {
                'out_trade_no' : tradNo
            }

            queryParams['app_id'] = '205781355331697'
            const key = '5480079451bb27feb85473b44b15ea28'
            const sign = this._sign(queryParams, key)
            let newObj = {sign}
            let data = Object.assign(newObj, queryParams);

            let url = `https://api.mianbaoduo.com/release/main/search_order`
            let mbdResult = await http.post({url, params:data})
            if (mbdResult && mbdResult.status == 200) {
                console.log("onMbdHook before:", mbdResult.data)
                let order = await this.syncOrder(mbdResult.data)
                console.log("onMbdHook order:", order.data)
                await this.updatePayUserExp(order.data)
                await this.notificationToWX(order.data)
                result = order
            }
        }
        return result
    }

    async md2vidHook() {
        const {ctx, config} = this
        const {request} = ctx
        const {http} = request
        const params = request.body

        let result = {}

        let tradNo = params.data.out_trade_no
        console.log('md2vidHook params:', params)
        if (tradNo) {
            console.log('-----mbd, md2vid -----')
            let url = `https://md2vid.com/api/v1/mbd`
            let mdResult = await http.post({url, params})
            if (mdResult && mdResult.status == 200) {
                console.log("md2vidHook before:", mdResult.data)
                result = mdResult
            }
        }
        return result
    }
    async syncOrder(params) {
        const expObject = AV.Object.extend('qun_orders')
        const item = new expObject()

        const attach = params.attach.split(",")
        let plusinfo = {uid: attach[0], r: attach[1], d: attach[2]}
        console.log("syncOrder plusinfo:", plusinfo)
        // 修改属性
        item.set('order_id', params.outTradeNo)
        item.set('charge_id', params.orderNo)
        item.set('description', params.payBank)
        item.set('amount', params.money)
        item.set('state', params.code)
        item.set('create_time', params.time)
        item.set('payway', params.payChannel)
        item.set('user_id', plusinfo.uid)
        item.set('qr_id', plusinfo.r)
        item.set('day', plusinfo.d)
        // 保存到云端
        return item.save().then(async (obj) => {
            let newItem = {}
            if (obj) {
                newItem = {
                    order_id: obj.get('order_id'),
                    amount: obj.get('amount'),
                    payway: obj.get('payway'),
                    state: obj.get('state'),
                    user_id: obj.get('user_id'),
                    qr_id: obj.get('qr_id'),
                    day: obj.get('day')
                }
            }
            return {data: newItem}
        }, (error) => {
            console.log(error)
            return {data: {code: error.code}}
        })
    }
    async queryMbdOrder() {
        const {ctx} = this
        const {username, qr_id} = ctx.request.body

        const expiration = new AV.Query('qun_orders')
        expiration.equalTo('user_id', username)
        expiration.equalTo('qr_id', qr_id)

        return expiration.first().then(function(obj) {
            let newItem = {}
            if (obj) {
                newItem = {
                    order_id: obj.get('order_id'),
                    amount: obj.get('amount'),
                    payway: obj.get('payway'),
                    state: obj.get('state'),
                    user_id: obj.get('user_id'),
                    qr_id: obj.get('qr_id'),
                    day: obj.get('day')
                }
            }
            console.log("order:", newItem)
            return {data: newItem}
        })
    }
    async queryYunOrder() {
        const {ctx} = this
        const {username, qr_id} = ctx.request.body

        const expiration = new AV.Query('qun_orders')
        expiration.equalTo('user_id', username)
        expiration.equalTo('qr_id', qr_id)

        console.log("query:", username, qr_id)
        return expiration.first().then(function(obj) {
            let newItem = {}
            if (obj) {
                newItem = {
                    order_id: obj.get('order_id'),
                    amount: obj.get('amount'),
                    payway: obj.get('payway'),
                    state: obj.get('state'),
                    user_id: obj.get('user_id'),
                    qr_id: obj.get('qr_id'),
                    day: obj.get('day')
                }
            }
            console.log("order:", newItem)
            return {data: newItem}
        })
    }
    async queryYunGouOrderExist(orderId) {
        const expiration = new AV.Query('qun_orders')
        expiration.equalTo('order_id', orderId)

        return expiration.first().then(function(obj) {
            let newItem = {}
            if (obj) {
                newItem = {
                    order_id: obj.get('order_id'),
                    charge_id: obj.get('charge_id')
                }
            }
            console.log("order:", newItem)
            return newItem
        })
    }

    /**
     * 更新会员时间
     */
     async updatePayUserExp(params) {
        let userName = params.user_id
        let day = params.day

        console.log("updatePayUserExp:", userName, day)

        const days = {
            1: 24 * 60 * 60 * 1000,
            3: 3 * 24 * 60 * 60 * 1000,
            7: 7 * 24 * 60 * 60 * 1000,
            30: 30 * 24 * 60 * 60 * 1000,
            31: 31 * 24 * 60 * 60 * 1000,
            91: 91 * 24 * 60 * 60 * 1000,
            183: 183 * 24 * 60 * 60 * 1000,
            365: 365 * 24 * 60 * 60 * 1000,
            666: 30 * 365 * 24 * 60 * 60 * 1000
        }
        const updateTime = days[day]
        const expiration = new AV.Query('Expiration')
        expiration.equalTo('username', userName)
        return expiration.first().then(function(account) {
            console.log("first account:")
            let orgExporationAt = account.get('expirationAt')
            if (account) {
                const objectId = account.id
                const exp = AV.Object.createWithoutData('Expiration', objectId)
                // 设置过期时间
                const date = new Date()
                let baseTime = date.getTime()

                if (orgExporationAt) {
                    orgExporationAt = new Date(orgExporationAt).getTime()
                }
                console.log('==account===', orgExporationAt, baseTime)

                if (orgExporationAt && (orgExporationAt > baseTime)) {
                    baseTime = orgExporationAt
                }
                date.setTime(baseTime + updateTime)
                exp.set('expirationAt', date)
                // 保存到云端
                return exp.save().then((res) => {
                    return {data: res}
                })
            } else {
                const error = `no user ${userName}`
                ctx.app.logger.error(error)
                return {data: {err: error}}
            }

        })

    }
    async notificationToWX(params) {
        const {ctx} = this
        const {request} = ctx
        const {http} = request
        let content = encodeURI(`${params.user_id} 支付会员费${params.amount}元~`)
        let url = `http://wxpusher.zjiecode.com/api/send/message/?appToken=AT_FujxrhaTdl1fc4db7jE2jxny0bbZXUbg&content=vip&uid=UID_lnoS7bIPoCKEE60jEXx583rI8OlN&summary=${content}`
        console.log('-----notificationToWX before-----')

        let notiRes = await http.get({url})
        console.log('-----notificationToWX after-----')

        return notiRes
    }
    async wxPayQrcode() {
        const {ctx} = this
        const {request} = ctx
        const {http} = request
        const params = request.body
        const name = params.name || "群合影会员"
        const fee = params.fee
        const attach = params.attach
        // 签名的参数准备
        const dateTime = new Date().getTime()
        let transParams = {
            "out_trade_no": "qun" + dateTime,
            "total_fee": fee,
            "mch_id": 1635138365,
            "body": name
        }
        // 最后加上 商户Key
        const key = yungouosKey;
        const signValue = this._sign(transParams, key);
        transParams["sign"] = signValue
        transParams["notify_url"] = "http://geektomato.com/qun/yungou/hook"
        transParams["attach"] = attach

        // 获取yungouos的返回二维码信息
        const url = "https://api.pay.yungouos.com/api/pay/wxpay/nativePay"

        console.log(url, transParams)
        let mdResult = await http.post({url, extParams: transParams})
        return mdResult;
    }
    async onYungouosHook() {
        const {ctx, config} = this
        const {request} = ctx
        const {http} = request
        const params = request.body

        let result = ""

        let tradNo = params.outTradeNo
        console.log('params:', params)
        if (tradNo) {
            let signValue = params.sign
            let transParams = {
                "code": params.code,
                "orderNo": params.orderNo,
                "payNo": params.payNo,
                "outTradeNo": params.outTradeNo,
                "money": params.money,
                "mchId": params.mchId
            }
            // 验签验证金额
            const key = yungouosKey
            const sign = this._sign(transParams, key)

            if (sign  == signValue) {
                let orderExist = await this.queryYunGouOrderExist(tradNo)
                if (orderExist && orderExist.charge_id) {
                    console.log("orderExist:", orderExist)
                } else {
                    let order = await this.syncOrder(params)
                    console.log("onYunHook order:", order)
                    await this.updatePayUserExp(order.data)
                    await this.notificationToWX(order.data)
                }
                result = "SUCCESS"
            }
        }
        return result
    }
    async tabhubHook() {
        const {ctx, config} = this
        const {request} = ctx
        const {http} = request
        const params = request.body

        let result = ""

        let tradNo = params.outTradeNo
        console.log('tabhubHook params:', params)
        if (tradNo) {
            console.log('-----yungouos, tabhub -----')
            let url = `https://tabhub.md2vid.com/api/th/v1/pay/yungouos`
            let mdResult = await http.post({url, params})
            if (mdResult && mdResult.status == 200) {
                console.log("tabhubHook after send:", mdResult.data)
                result = "SUCCESS"
            }
        }
        return result
    }
}

module.exports = QunService
