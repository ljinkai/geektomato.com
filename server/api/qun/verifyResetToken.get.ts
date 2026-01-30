import { UserRepository } from '../../repositories/user.repository';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = typeof query.token === 'string' ? query.token : '';

  if (!token) {
    return { code: 400, msg: '缺少 token' };
  }

  const repo = new UserRepository();
  const user = repo.findByResetToken(token);

  if (!user) {
    return { code: 400, msg: '重置链接已失效或不存在' };
  }

  return {
    code: 0,
    msg: 'ok',
    data: {
      userId: user.username,
      email: user.email
    }
  };
});

