'use strict'

module.exports = app => {
    const {router, controller, middleware} = app
    const isAuthQunUser = middleware.token()
    const unLoginBack = middleware.token('back') // 未登录page返回首页时会带有?back=rul
    // const isOpsSys = middleware.sys()

    const {
        home,
        login,
        notify,
        qun,
        qunBot,
        geek,
        about,
        indiemaker,
    } = controller

    // healthy check
    router.get('/server.run', notify.serverRun)

    // home
    router.get('/', home.index)
    router.get('/home/list', home.list)

    // qunheying.com
    router.get('/qun/config', qun.configInfo) // 已验证
    router.post('/qun/userAdd', qun.registerUser) // 已验证
    router.post('/qun/userLogin', qun.loginUser) // 已验证
    router.post('/qun/synchronizationUser', qun.synchronizationUserInfo) // 已验证
    router.post('/qun/updateExp', qun.updateExp)
    router.post('/qun/updatePass', qun.updatePass)
    router.get('/qun/updateExp', qun.updateExpPage)
    router.post('/qun/forgetUser', qun.forgetUser)
    router.post('/qun/roomsList', qun.roomsList)
    router.post('/qun/yungou/hook', qun.yungouosHook)
    router.post('/qun/mbd_order_state', qun.mbdQueryOrder)
    router.post('/qun/yun_order_state', qun.yunQueryOrder)
    router.post('/qun/wx/qrcode', qun.wxPayQrcode)
    router.get('/qunBot/qrcode', qunBot.getQrcode)
    router.post('/qunBot/getRoomList', qunBot.getRoomList)
    router.post('/qunBot/getMemberAll', qunBot.getMemberAll)
    router.post('/qunBot/checkState', qunBot.checkState)
    router.get('/qunBot/logoutH', qunBot.logoutH)
    router.get('/qunBot/restartH', qunBot.restartH)
    router.get('/qunBot/stopH', qunBot.stopH)
    router.get('/qunBot/logonoff', qunBot.logonoff)

    // login
    // router.get('/login', login.index)
    router.post('/login/facebook', login.facebookLogin)
    router.post('/login/google', login.googleLogin)
    router.post('/login/signUp', login.signUp)
    router.post('/login', login.login)

    // item
    router.get('/i/:id', geek.viewItem)
    router.get('/addItem', geek.addItemIndex)
    router.post('/addItem', geek.addItem)

    // about
    router.get('/about', about.index)
    // weekly
    router.get('/weekly', geek.weekly)
    // indiemaker
    router.get('/im/productHunt', indiemaker.productHunt)
    router.get('/im/indiehackers', indiemaker.indieHackers)
    router.get('/im/github', indiemaker.github)
    router.get('/im/home', indiemaker.imstartHomeData)
    router.get('/im/home_pd', indiemaker.imstartHomePD)
    router.get('/im/home_id', indiemaker.imstartHomeID)
    router.get('/im/home_idcom', indiemaker.imstartHomeIDCom)
    router.get('/im/home_v2ex', indiemaker.v2ex)
    router.get('/im/home_github', indiemaker.imstartHomeGithub)
    router.get('/im/all', indiemaker.allFetch)

    // reset
    // router.get('/account/reset', isLoginUser, account.index)
    // router.post('/account/reset', isLoginUser, account.reset)
    // forget
    // router.get('/account/forget', account.forget)
    // router.post('/account/_forget', account.sendForgetUrl)
    // router.get('/account/forgetReset', account.forgetReset)
    // router.post('/account/_forgetReset', account.forgetResetDo)
}
