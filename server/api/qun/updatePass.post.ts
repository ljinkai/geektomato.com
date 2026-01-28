import { QunUserService } from '../../services/qun/user.service';
import { UserRepository } from '../../repositories/user.repository';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    userId: number;
    oldPassword: string;
    newPassword: string;
  }>(event);

  if (
    !body ||
    typeof body.userId !== 'number' ||
    !body.oldPassword ||
    !body.newPassword
  ) {
    return { code: 400, msg: '缺少 userId / oldPassword / newPassword' };
  }

  const repo = new UserRepository();
  const user = repo.findById(body.userId);
  if (!user) {
    return { code: 404, msg: '用户不存在' };
  }

  const service = new QunUserService();
  const canLogin = await service.login(
    String(user.username ?? user.id),
    body.oldPassword
  );
  if (!canLogin) {
    return { code: 403, msg: '旧密码错误' };
  }

  await service.updatePassword(body.userId, body.newPassword);

  return {
    code: 0,
    msg: 'ok'
  };
});


