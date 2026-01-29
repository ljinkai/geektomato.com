import jws from 'jws';

const config = {
  algorithm: 'HS256' as const,
  secret: 'qunheying0218'
};

/**
 * 生成 JWT token（兼容旧系统格式）
 * 
 * @param payload - 用户信息 { userId, userName, id, sessionToken }
 * @param exp - 过期时间（Unix 时间戳，秒）
 * @returns JWT token 字符串
 */
export function signToken(
  payload: {
    userId: string;
    userName: string;
    id: string;
    sessionToken: string;
  },
  exp: number
): Promise<string> {
  const r = {
    iat: Math.floor(Date.now() / 1000),
    exp,
    payload
  };

  return new Promise((resolve, reject) => {
    jws
      .createSign({
        header: { alg: config.algorithm },
        secret: config.secret,
        payload: JSON.stringify(r)
      })
      .on('done', function (signature) {
        resolve(signature);
      })
      .on('error', function (err) {
        reject(err);
      });
  });
}

/**
 * 验证 JWT token
 * 
 * @param signature - JWT token 字符串
 * @returns 解析后的 payload 对象
 */
export function verifyToken(signature: string): Promise<{
  iat: number;
  exp: number;
  payload: {
    userId: string;
    userName: string;
    id: string;
    sessionToken: string;
  };
}> {
  return new Promise((resolve, reject) => {
    jws
      .createVerify({
        algorithm: config.algorithm,
        secret: config.secret,
        signature
      })
      .on('done', function (verified, obj) {
        if (verified) {
          const r = JSON.parse(obj.payload);
          resolve(r);
        } else {
          reject(new Error('Token verification failed'));
        }
      })
      .on('error', function (err) {
        reject(err);
      });
  });
}
