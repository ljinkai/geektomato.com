import { QunUserService } from '../../services/qun/user.service';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    username?: string;
    mobilePhoneNumber?: string;
    email?: string;
    password?: string;
    nickName?: string;
  }>(event);

  if (!body?.mobilePhoneNumber && !body?.email && !body?.username) {
    return { code: 400, msg: '缺少用户唯一标识（username/mobilePhoneNumber/email)' };
  }

  const service = new QunUserService();

  // 简化实现：如果能登录说明已存在，否则按提供的信息创建
  let user =
    (body.username || body.mobilePhoneNumber) && body.password
      ? await service.login(
          body.username ?? body.mobilePhoneNumber!,
          body.password
        )
      : undefined;

  if (!user && body.password && body.nickName) {
    user = await service.register({
      username: body.username,
      mobilePhoneNumber: body.mobilePhoneNumber,
      email: body.email,
      password: body.password,
      nickName: body.nickName
    });
  }

  if (!user) {
    return { code: 400, msg: '同步失败：缺少创建用户所需字段（password/nickName）' };
  }

  return {
    code: 0,
    msg: 'ok',
    data: {
      id: user.id,
      username: user.username,
      mobilePhoneNumber: user.mobile_phone_number,
      nickName: user.nick_name
    }
  };
});


