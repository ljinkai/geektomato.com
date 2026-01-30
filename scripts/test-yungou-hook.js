#!/usr/bin/env node

/**
 * 测试 /qun/yungou/hook 接口的 Node.js 脚本
 * 此脚本会正确计算签名
 */

const crypto = require('crypto');

// Yungouos 密钥
const YUNGOUOS_KEY = '555996BFBDB54D0397663F42B8511FE0';

// 服务器地址
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

/**
 * 计算签名
 * @param {Object} params - 需要签名的参数
 * @param {string} key - 密钥
 * @returns {string} MD5 签名（大写）
 */
function calculateSign(params, key) {
  // 获取所有 key 并排序
  const paramsArr = Object.keys(params).sort();
  
  // 生成 key=value 格式的数组
  const stringArr = paramsArr.map(k => `${k}=${params[k]}`);
  
  // 添加密钥
  stringArr.push(`key=${key}`);
  
  // 拼接字符串
  const str = stringArr.join('&');
  console.log('签名原始字符串:', str);
  
  // MD5 加密并转大写
  const signStr = crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase();
  return signStr;
}

/**
 * 发送测试请求
 */
async function testHook() {
  // 测试参数（基于 old_script.md 中的示例）
  const timestamp = Date.now();
  const testParams = {
    code: '1',
    mchId: '1635138365',
    orderNo: `Y${timestamp}`,
    payNo: `4200002980202601307163506101`,
    outTradeNo: `qun${timestamp}`,
    money: '15.80',
    // 以下参数不参与签名，但会传递给接口
    openId: 'o-_-it_l-Cc2zQxc93z3gKFcvE5A',
    payBank: '交通银行（信用卡）',
    payChannel: 'wxpay',
    attach: 'l1,1769769950159-c671xdvl0u9,31',
    time: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  // 计算签名（只使用参与签名的参数）
  const signParams = {
    code: testParams.code,
    mchId: testParams.mchId,
    orderNo: testParams.orderNo,
    payNo: testParams.payNo,
    outTradeNo: testParams.outTradeNo,
    money: testParams.money
  };

  const sign = calculateSign(signParams, YUNGOUOS_KEY);
  testParams.sign = sign;

  console.log('=== 测试：Yungouos 支付回调 Hook ===\n');
  console.log('注意：此脚本测试 Yungouos 回调格式（迁移后的实现）\n');
  console.log('请求参数:');
  console.log(JSON.stringify(testParams, null, 2));
  console.log('\n发送请求...\n');

  try {
    // 使用 Node.js 内置模块发送请求
    const url = new URL(`${BASE_URL}/qun/yungou/hook`);
    const httpModule = url.protocol === 'https:' ? require('https') : require('http');
    
    const postData = JSON.stringify(testParams);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    return new Promise((resolve, reject) => {
      const req = httpModule.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          console.log('响应状态:', res.statusCode, res.statusMessage);
          console.log('响应内容:', responseData);
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('\n✓ 请求成功');
          } else {
            console.log('\n✗ 请求失败');
          }
          resolve();
        });
      });

      req.on('error', (error) => {
        console.error('请求错误:', error.message);
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  } catch (error) {
    console.error('请求错误:', error.message);
    process.exit(1);
  }
}

// 运行测试
testHook().catch(console.error);
