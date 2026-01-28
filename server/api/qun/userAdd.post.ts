import { QunUserService } from '../../services/qun/user.service';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    username?: string;
    mobilePhoneNumber?: string;
    email?: string;
    password: string;
    nickName: string;
  }>(event);

  if (!body?.password || !body?.nickName) {
    return { code: 400, msg: '缺少必填字段 password 或 nickName' };
  }

  const service = new QunUserService();
  const user = await service.register(body);

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


