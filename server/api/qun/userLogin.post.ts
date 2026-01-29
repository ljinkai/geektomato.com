import crypto from 'node:crypto';
import { QunUserService } from '../../services/qun/user.service';
import { UserRepository } from '../../repositories/user.repository';
import { signToken } from '../../utils/jws';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    userId?: string;
    usernameOrMobile?: string;
    password: string;
  }>(event);

  const identifier = body?.usernameOrMobile ?? body?.userId;

  if (!identifier || !body?.password) {
    return {
      success: false,
      data: {
        err_code: 1000,
        err_msg: {
          code: 210,
          rawMessage: 'The username and password mismatch.'
        }
      }
    };
  }

  const service = new QunUserService();
  const user = await service.login(identifier, body.password);

  if (!user) {
    // 按旧接口约定返回错误结构
    return {
      success: false,
      data: {
        err_code: 1000,
        err_msg: {
          code: 210,
          rawMessage: 'The username and password mismatch.'
        }
      }
    };
  }

  // 生成或获取 sessionToken
  let sessionToken = user.session_token;
  if (!sessionToken) {
    // 生成新的 sessionToken（类似 LeanCloud 的格式）
    sessionToken = crypto.randomBytes(16).toString('base64').replace(/[+/=]/g, '');
    
    // 更新用户的 sessionToken
    const repo = new UserRepository();
    repo.updateSessionToken(user.id, sessionToken);
  }

  // 生成 JWT token（兼容旧系统格式）
  const userId = user.username || user.mobile_phone_number || String(user.id);
  const userName = user.nick_name;
  const id = user.lc_object_id || String(user.id);
  const exp = Math.floor(Date.now() / 1000); // 当前时间作为过期时间（旧系统逻辑）

  const token = await signToken(
    {
      userId,
      userName,
      id,
      sessionToken
    },
    exp
  );

  // 返回格式：{ success: true, data: { userId, userName, token } }
  return {
    success: true,
    data: {
      userId,
      userName,
      token
    }
  };
});


