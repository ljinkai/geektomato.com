const jws = require('jws')

const config = {
    algorithm: 'HS256',
    secret: 'qunheying0218'
}

// 用Promise封装jws签名接口
module.exports.sign = async function(payload, exp) {
    const r = {
        iat: new Date().getTime() / 1000,
        exp,
        payload
    }

    const promise = new Promise((resolve, reject) => {
        jws.createSign({
            header: {alg: config.algorithm},
            secret: config.secret,
            payload: JSON.stringify(r),
        }).on('done', function(signature) {
            resolve(signature)
        })
    })
    return promise
}

// 用Promise封装jws验证接口
module.exports.verify = function(signature) {
    const promise = new Promise((resolve, reject) => {
        jws.createVerify({
            algorithm: config.algorithm,
            secret: config.secret,
            signature,
        }).on('done', function(verified, obj) {
            if (verified) {
                const r = JSON.parse(obj.payload)
                resolve(r)
            } else {
                reject()
            }
        })
    })
    return promise
}