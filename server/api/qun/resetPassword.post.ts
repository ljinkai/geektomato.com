import { UserRepository } from '../../repositories/user.repository';
import { QunUserService } from '../../services/qun/user.service';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    token: string;
    newPassword: string;
  }>(event);

  if (!body?.token || !body?.newPassword) {
    return { code: 400, msg: '缺少 token 或新密码' };
  }

  if (body.newPassword.length < 6) {
    return { code: 400, msg: '新密码长度不能少于 6 位' };
  }

  const repo = new UserRepository();
  const user = repo.findByResetToken(body.token);

  if (!user) {
    return { code: 400, msg: '重置链接已失效或不存在' };
  }

  const service = new QunUserService();
  await service.updatePassword(user.id, body.newPassword);
  repo.clearResetToken(user.id);

  return {
    code: 0,
    msg: '密码重置成功，请使用新密码登录'
  };
});

