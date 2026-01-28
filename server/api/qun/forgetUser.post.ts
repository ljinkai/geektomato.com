import { QunUserService } from '../../services/qun/user.service';
import { UserRepository } from '../../repositories/user.repository';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    usernameOrMobile: string;
  }>(event);

  if (!body?.usernameOrMobile) {
    return { code: 400, msg: '缺少用户名或手机号' };
  }

  const repo = new UserRepository();
  const user = repo.findByUsernameOrMobile(body.usernameOrMobile);
  if (!user) {
    return { code: 404, msg: '用户不存在' };
  }

  // 简化逻辑：直接重置为随机密码并返回（生产环境请改为发邮件/短信）
  const newPassword = Math.random().toString(36).slice(-10);
  const service = new QunUserService();
  await service.updatePassword(user.id, newPassword);

  return {
    code: 0,
    msg: 'ok',
    data: {
      userId: user.id,
      newPassword
    }
  };
});


