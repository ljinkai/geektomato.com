'use strict'


const AV = require('leancloud-storage')

const QunBotLeanService = {
    /**
     * 获取配置信息
     */
    async getList(params) {
        const {ctx} = this
        const {request} = ctx
        const {skip, limit} = ctx.request.query

        const query = new AV.Query('geek_items')
        // 根据用户id做更新操作
        query.addDescending('date')
        query.limit(limit || 20);// 最多返回 10 条结果
        query.skip(skip || 0);// 跳过 20 条结果
        return query.find().then(function(items) {
            const newItems = items.map((obj, key, arr) => {
                const tmp = {
                    id: obj.get('uid'),
                    title: obj.get('title'),
                    content: obj.get('content'),
                    img: obj.get('img'),
                    origin: obj.get('origin'),
                    words: obj.get('words'),
                    date: obj.get('date')
                }
                return tmp
            })
            return {data: newItems}
        }, function(error) {
        })
    },
    /**
     * 获取配置信息
     */
    async addItem(params) {
        const userName = params.userName
        console.log('==000',userName)
        const query = new AV.Query('_User')
        // 根据用户id做更新操作
        query.equalTo('nickName', userName)
        const user = await query.first().then(function(obj) {
            const newItem = {
                nickName: obj.get('nickName'),
                username: obj.get('username')
            }
            return newItem
        }, function(error) {
            return {data: {err: error}}
        })
        if (user && user.username) {
            // 1、查询看是否存在shadow user
            const queryShadow = new AV.Query('UserShadow')
            // 根据用户id做更新操作
            queryShadow.equalTo('wxId', params.wxId)
            let exsitUser = await queryShadow.first().then(function(obj) {
                let newItem = {}
                if (obj) {
                    newItem = {
                        wxId: obj.get('wxId'),
                        userId: obj.get('userId')
                    }
                }
                return newItem
            }, function(error) {
                return {data: {err: error}}
            })
            // 2、add new link width wxid and username to UserShadow
            if (exsitUser && exsitUser.wxId) {
            } else {
                const expObjectShadow = AV.Object.extend('UserShadow')
                const userShadow = new expObjectShadow()

                // 修改属性
                userShadow.set('userId', user.username)
                userShadow.set('wxId', params.wxId)
                userShadow.set('nickName', userName)

                exsitUser = await userShadow.save().then(async (obj) => {
                    const newItem = {
                        id: obj.get('uid'),
                        wxId: obj.get('wxId'),
                        userId: obj.get('userId')
                    }
                    return newItem
                })
            }

            //3、save info to rooms
            if (exsitUser && exsitUser.wxId) {

                const queryRooms = new AV.Query('Rooms')
                // 根据用户id做更新操作
                queryRooms.equalTo('roomId', params.roomId)
                queryRooms.equalTo('wxId', params.wxId)
                let exsitRoom = await queryRooms.first().then(function(obj) {
                    let newItem = {}
                    if (obj) {
                        newItem = {
                            objectId: obj.id,
                            wxId: obj.get('wxId'),
                            roomId: obj.get('roomId')
                        }
                    }
                    return newItem
                }, function(error) {
                    return {data: {err: error}}
                })

                if (exsitRoom.roomId) {// update the exsit
                    const objectId = exsitRoom.objectId
                    const objRoom = AV.Object.createWithoutData('Rooms', objectId)
                    // 修改属性
                    objRoom.set('memberAll', params.memberAll)
                    objRoom.set('roomName', params.roomName)
                    objRoom.set('userName', userName)
                    // 保存到云端
                    const newRoom = await objRoom.save().then(async (obj) => {
                        const newItem = {
                            id: obj.get('objectId'),
                            roomName: obj.get('roomName'),
                            roomId: obj.get('roomId')
                        }
                        return {data: newItem}
                    }, function(error) {
                        return {data: {err: error}}
                    })
                    return newRoom

                } else {
                    // 保存到云端
                    const expObject = AV.Object.extend('Rooms')
                    const item = new expObject()

                    // 修改属性
                    item.set('memberAll', params.memberAll)
                    item.set('roomId', params.roomId)
                    item.set('wxId', params.wxId)
                    item.set('roomName', params.roomName)
                    item.set('userName', userName)
                    item.set('userId', exsitUser.userId)

                    const newRoom = await item.save().then(async (obj) => {
                        const newItem = {
                            id: obj.get('objectId'),
                            roomName: obj.get('roomName'),
                            roomId: obj.get('roomId')
                        }
                        return {data: newItem}
                    }, function(error) {
                        return {data: {err: error}}
                    })
                    return newRoom

                }



            }
        }


        // // 保存到云端
        // return item.save().then(async (obj) => {
        //     const newItem = {
        //         id: obj.get('uid'),
        //         roomName: obj.get('roomName'),
        //         roomId: obj.get('roomId')
        //     }
        //     return {data: newItem}
        // })
    },
    /**
     * 获取配置信息
     */
    async getItem(params) {
        const {ctx} = this
        const {request} = ctx
        const {id, title} = ctx.params

        const query = new AV.Query('geek_items')
        // 根据用户id做更新操作
        query.equalTo('uid', id)

        return query.first().then(function(obj) {
            const tmp = {
                id: obj.get('uid'),
                title: obj.get('title'),
                content: obj.get('content'),
                img: obj.get('img'),
                origin: obj.get('origin'),
                words: obj.get('words'),
                date: obj.get('date')
            }
            return {data: tmp}
        }, function(error) {
            ctx.app.logger.error(error)
            return {data: {err: error}}
        })
    }
}

module.exports = QunBotLeanService
