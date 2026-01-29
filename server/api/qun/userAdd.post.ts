import crypto from 'node:crypto';
import { QunUserService } from '../../services/qun/user.service';
import { UserRepository } from '../../repositories/user.repository';
import { signToken } from '../../utils/jws';

export default defineEventHandler(async (event) => {
  const raw = await readBody<
    | {
        // 新格式
        username?: string;
        mobilePhoneNumber?: string;
        email?: string;
        password?: string;
        nickName?: string;
      }
    | {
        // 旧格式：来自 v1
        userId: string;
        userName: string;
        password: string;
        checkPass?: string;
        email?: string;
      }
  >(event);

  let username: string | undefined;
  let nickName: string | undefined;
  let email: string | undefined;
  let password: string | undefined;

  // 兼容旧参数：{ userId, userName, password, checkPass, email }
  if ('userId' in raw || 'userName' in raw) {
    const legacy = raw as {
      userId: string;
      userName: string;
      password: string;
      checkPass?: string;
      email?: string;
    };

    // 确认密码一致（如果提供了 checkPass）
    if (legacy.checkPass && legacy.checkPass !== legacy.password) {
      return { success: false, data: { err: 'password_mismatch' } };
    }

    username = legacy.userId;
    nickName = legacy.userName || legacy.userId;
    email = legacy.email;
    password = legacy.password;
  } else {
    const body = raw as {
      username?: string;
      mobilePhoneNumber?: string;
      email?: string;
      password?: string;
      nickName?: string;
    };
    username = body.username;
    nickName = body.nickName;
    email = body.email;
    password = body.password;
  }

  if (!password || !nickName) {
    return {
      success: false,
      data: {
        err_code: 1000,
        err_msg: {
          code: 400,
          rawMessage: '缺少必填字段 password 或 nickName'
        }
      }
    };
  }

  const repo = new UserRepository();

  // 唯一性校验：用户名
  if (username) {
    const existingUserByName = repo.findByUsername(username);
    if (existingUserByName) {
      // LeanCloud 中 code 202 通常表示用户名已被占用
      return {
        success: false,
        data: {
          err_code: 1000,
          err_msg: {
            code: 202,
            rawMessage: '此用户名已经被占用。'
          }
        }
      };
    }
  }

  // 唯一性校验：邮箱
  if (email) {
    const existingUserByEmail = repo.findByEmail(email);
    if (existingUserByEmail) {
      // 按你给出的旧接口示例：code=203 + “此电子邮箱已经被占用。”
      return {
        success: false,
        data: {
          err_code: 1000,
          err_msg: {
            code: 203,
            rawMessage: '此电子邮箱已经被占用。'
          }
        }
      };
    }
  }

  const service = new QunUserService();
  const user = await service.register({
    username,
    mobilePhoneNumber: undefined,
    email,
    password,
    nickName
  });

  // 生成 sessionToken 并写入数据库（用于 JWT payload）
  let sessionToken = user.session_token;
  if (!sessionToken) {
    sessionToken = crypto.randomBytes(16).toString('base64').replace(/[+/=]/g, '');
    const repo = new UserRepository();
    repo.updateSessionToken(user.id, sessionToken);
  }

  // 生成 JWT token（兼容旧系统格式）
  const userId = user.username || user.mobile_phone_number || String(user.id);
  const userName = user.nick_name;
  const id = user.lc_object_id || String(user.id);
  const exp = Math.floor(Date.now() / 1000);

  const token = await signToken(
    {
      userId,
      userName,
      id,
      sessionToken
    },
    exp
  );

  // 返回与 v1 一致的结构：{ success: true, data: { userId, userName, token } }
  return {
    success: true,
    data: {
      userId,
      userName,
      token
    }
  };
});


