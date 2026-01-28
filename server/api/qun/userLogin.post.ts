import { QunUserService } from '../../services/qun/user.service';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    usernameOrMobile: string;
    password: string;
  }>(event);

  if (!body?.usernameOrMobile || !body.password) {
    return { code: 400, msg: '缺少用户名/手机号或密码' };
  }

  const service = new QunUserService();
  const user = await service.login(body.usernameOrMobile, body.password);

  if (!user) {
    return { code: 401, msg: '用户名或密码错误' };
  }

  // 这里只返回一个简单的伪 token，后续可接入真正的 JWT / 会话机制
  const token = `${user.id}:${Date.now()}`;

  return {
    code: 0,
    msg: 'ok',
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


