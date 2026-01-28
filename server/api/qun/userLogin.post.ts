import { QunUserService } from '../../services/qun/user.service';

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

  // 成功时返回 success: true，并附带用户与 token 信息
  const token = `${user.id}:${Date.now()}`;

  return {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        mobilePhoneNumber: user.mobile_phone_number,
        nickName: user.nick_name,
        exp: user.exp
      }
    }
  };
});


