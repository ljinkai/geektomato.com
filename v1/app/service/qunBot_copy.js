// 'use strict'

// const Service = require('egg').Service
// const {Wechaty, log, ScanStatus, Contact} = require('wechaty')
// // const { ScanStatus } = require('wechaty-puppet')
// // const {QrcodeTerminal} = require('qrcode-terminal')
// const leancloud = require('./qunBotLean.js')
// const schedule = require('node-schedule')

// // const token = 'puppet_padplus_8c623dfcc3a59e76' 'puppet_donut_298fdb3919e3d794'
// const token = 'puppet_donut_948681d35d7ec2f8'


// const name = 'qunbot'
// let qrCodeData = {
//     qrcode: '',
//     status: 0,
//     qrcodeImageUrl: ''
// }

// let GUser = {}
// let LoginUser = {}
// let ScanStatusScanedTime = null

// let bot = null
// let botRestartNumber = 0

// function initBot() {
//     bot = new Wechaty({
//         puppet: 'wechaty-puppet-hostie',
//         puppetOptions: {
//             token,
//         }
//     })

//     bot
//         .on('scan', (qrcode, status) => {
//             qrCodeData.status = status
//             console.log("=1=", qrcode, status)
//             if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
//                 // require('qrcode-terminal').generate(qrcode) // show qrcode on console

//                 const qrcodeImageUrl = [
//                     'https://api.qrserver.com/v1/create-qr-code/?data=',
//                     encodeURIComponent(qrcode),
//                 ].join('')

//                 qrCodeData.qrcode = qrcode
//                 qrCodeData.qrcodeImageUrl = qrcodeImageUrl

//                 log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
//             } else {
//                 log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
//             }
//         })
//         .on('message', async msg => {
//             const text = msg.text()

//             if (/^qhy::room::/i.test(text)) {
//                 const roomName = text.split('qhy::room::')[1]

//                 const roomSingle = await bot.Room.find({topic: roomName})
//                 if (roomSingle) {
//                     console.log('qhy::room::==', roomSingle.topic())
//                     await getMemberListAndSaveToLean(roomSingle, GUser)
//                 }
//                 return
//             } else if (/^qhy::logout/i.test(text)) {

//                 await resetInit()

//                 await bot.logout()
//                 await bot.reset()
//                 log.info('Bot message:', 'qhy::logout')
//                 return
//             } else if (/^qhy::reset/i.test(text)) {
//                 await resetInit()
//                 await bot.stop()
//                 await bot.start()
//                 log.info('Bot message:', 'qhy::reset')
//                 return
//             }
//         })
//         .on('login', async function(user) {
//             log.info('StarterBot user id:', user.id);
//             GUser = user
//             // if (GUser.id != user.id) {
//             //     log.info('StarterBot:', 'begin reset');
//             //     GUser = user
//             //     await bot.reset()

//             // }

//             LoginUser = {userName: user.name(), userId: user.id}
//             qrCodeData = {
//                 qrcode: '',
//                 status: 0,
//                 qrcodeImageUrl: ''
//             }
//             log.info('StarterBot', '%s login', JSON.stringify(user))

//             setTimeout(async () => { // auto logout after 10 minutes
//                 await resetInit()
//                 await bot.logout()

//                 log.info('auto logout', '%s logout', user.name())
//             }, 600000)
//         })
//         .on('ready', async function() {
//             console.log('Bot ready now.')
//             // const roomList = await bot.Room.findAll()

//             // console.log("ready rommList:" + roomList.length);
//         })
//         .start()
//         .catch(e => {
//             console.error(e)
//             // process.exit(1)
//         })
// }

// async function resetInit() {
//     GUser = {}
//     LoginUser = {}
//     qrCodeData = {
//         qrcode: '',
//         status: 0,
//         qrcodeImageUrl: ''
//     }
//     ScanStatusScanedTime == null
// }
// async function getMemberListAndSaveToLean(room, user) {
//     const topic = await room.topic()
//     const wxId = user.id
//     const userName = user.name()
//     const arr = []
//     const all = await room.memberAll()
//     for (let i = 0; i < all.length; i++) {
//         const item = all[i]
//         const name = item.name()
//         // const avatar = await item.avatar()

//         const avatar = await item.avatar()
//         const temp = {name, avatar}
//         arr.push(temp)
//     }
//     const res = {
//         roomName: topic,
//         wxId,
//         userName,
//         roomId: room.id,
//         memberAll: arr,
//     }
//     const backRes = await leancloud.addItem(res)
//     return {room: backRes, memberData: res}
// }
// /**
//  * 注册一个新用户
//  */
// async function restart() {
//     log.info('restart:', 'begin::stop')
//     bot.stop()
//     log.info('restart:', 'begin::resetInit')
//     await resetInit()
//     log.info('restart:', 'begin::start')
//     bot.start()
//     botRestartNumber++
//     console.log('restart::', botRestartNumber)
// }

// async function diffTime(startDate, endDate) {
//     const diff = endDate.getTime() - startDate// .getTime();//时间差的毫秒数

//     // 计算出相差天数
//     const minutes = Math.floor(diff / (60 * 1000))

//     let returnStr = 0
//     if (minutes > 0) {
//         returnStr = minutes
//     }

//     return returnStr
// }

// initBot() // begin start

// const task1 = async () => {
//     let tmp = qrCodeData.qrcode
//     schedule.scheduleJob('*/20 * * * *', async () => {
//         console.log('scheduleCronstyle:' + new Date())
//         console.log(tmp, JSON.stringify(qrCodeData))
//         if ((tmp == qrCodeData.qrcode) && (qrCodeData.status == 2)) {
//             console.log('scheduleJob ::restart')
//             await restart()
//         } else if (qrCodeData.status == 5) {
//             console.log('scheduleJob ::restart:' + qrCodeData.status)
//             await restart()
//         } else {
//             tmp = qrCodeData.qrcode
//         }
//     })
// }

// // task1()
// class QunBotService extends Service {
//     async isSelf() {
//         const {ctx} = this
//         const {request} = ctx
//         const userName = request.body.userName ? request.body.userName : request.query.userName
//         let flag = false
//         if (userName && userName === LoginUser.userName) {
//             flag = true
//         }
//         return flag
//     }
//     /**
//      * 注册一个新用户
//      */
//     async getQrcode() {
//         const {ctx} = this
//         const {request} = ctx
//         const userName = request.query.userName
//         const {http} = request

//         const state = {login: false, self: false}
//         const loginUserName = LoginUser.userName
//         const temp = {...qrCodeData}
//         temp.state = state
//         if (loginUserName && (loginUserName === userName)) {
//             state.login = true
//             state.self = true
//             temp.state = state
//         }

//         return {data: temp}
//     }
//     async getRoomList() {
//         const arr = []
//         const roomList = await bot.Room.findAll()
//         console.log("rommList:" + roomList.length);
//         console.log("arr:" + arr.length);
//         if (roomList) {
//             // console.log(`room all member list: `, roomList);
//             for (let i = 0; i < roomList.length; i++) {
//                 const room = roomList[i]
//                 const name = await room.topic()
//                 arr.push(name)
//                 if (i > 400) {
//                     break
//                 }
//             }
//         }
//         return {data: arr}
//     }
//     /**
//      * 根据群名称获取群成员列表
//      */
//     async getMemberAll() {

//         const {ctx} = this
//         const {request} = ctx

//         await ctx.service.qunBot.isSelf()
//         const roomName = request.body.roomName
//         let res = null

//         // const roomList = await bot.Room.findAll()
//         // console.log(3)
//         // if (roomList) {
//         //     for (let i = 0; i < roomList.length; i++) {
//         //         const room = roomList[i]
//         //         const name = room.topic()
//         //         console.log(i + '==', name)
//         //     }
//         // }

//         const roomSingle = await bot.Room.find({topic: roomName})
//         // console.log("roomName",roomName, GUser,roomSingle)

//         if (roomSingle) {
//             res = await getMemberListAndSaveToLean(roomSingle, GUser)
//         }
//         return {data: res}
//     }

//     /**
//      * 注册一个新用户
//      */
//     async checkState() {
//         const {ctx} = this
//         const {request} = ctx
//         const userName = request.body.userName
//         const state = {login: false}
//         const loginUserName = LoginUser.userName
//         const temp = {...qrCodeData}
//         temp.state = state
//         // console.log(loginUserName, userName)
//         if (loginUserName && userName && loginUserName.indexOf(userName) >= 0) {
//             state.login = true
//             state.self = true
//             temp.state = state
//         } else if (qrCodeData.status === 5) {
//             console.log('checkstate::restart')
//             await restart()
//         } else if (qrCodeData.status === 3) {
//             console.log('checkstate::Scanned')
//             const diff = await diffTime(ScanStatusScanedTime, new Date())
//             if (ScanStatusScanedTime == null) {
//                 ScanStatusScanedTime = new Date()
//             } else if (diff > 1) { // 如果scaned状态保持5分钟，重新启动
//                 await restart()
//             }
//         }

//         return {data: temp}
//     }
//     /**
//      * 注册一个新用户
//      */
//     async logout() {
//         const {ctx} = this
//         const {request} = ctx
//         const userName = request.body.userName
//         await resetInit()
//         await bot.logout()
//         log.info('Bot handle message:', 'qhy::logout')

//         return {data: {}}
//     }
//     /**
//      * 注册一个新用户
//      */
//     async restart() {
//         const {ctx} = this
//         const {request} = ctx
//         await restart()
//         log.info('Bot restart message:', 'qhy::restart')

//         return {data: {}}
//     }
//     /**
//      * 注册一个新用户
//      */
//     async stop() {
//         const {ctx} = this
//         const {request} = ctx
//         bot.stop()
//         log.info('Bot stop message:', 'qhy::stop')

//         return {data: {}}
//     }
//     /**
//      * 注册一个新用户
//      */
//     async logonoff() {
//         const {ctx} = this
//         const {request} = ctx
//         const flag = bot.logonoff()
//         log.info('Bot logonoff state:', flag)

//         return {data: {flag}}
//     }
// }

// module.exports = QunBotService
