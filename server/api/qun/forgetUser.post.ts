import { UserRepository } from '../../repositories/user.repository';
import { sendResetPasswordMail } from '../../utils/mailer';
import crypto from 'node:crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    userId?: string;
    email?: string;
  }>(event);

  if (!body?.userId && !body?.email) {
    return { code: 400, msg: '缺少 userId 或 email' };
  }

  const repo = new UserRepository();
  let user =
    body.userId != null
      ? repo.findByUsername(body.userId)
      : null;
  if (!user && body.email) {
    user = repo.findByEmail(body.email);
  }

  // 出于安全考虑，即使用户不存在也返回成功提示，防止枚举账号
  if (!user) {
    return {
      code: 0,
      msg: '如果该账号存在且绑定了邮箱，我们已发送重置密码邮件'
    };
  }

  if (!user.email) {
    return {
      code: 400,
      msg: '此微信ID对应的邮箱不存在,请检查或者联系客服人员重置！'
    };
  }

  // 生成一次性重置 token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 分钟

  repo.setResetToken(user.id, token, expiresAt);

  const origin =
    process.env.PUBLIC_WEB_ORIGIN ||
    process.env.NUXT_PUBLIC_WEB_ORIGIN ||
    (process.env.NODE_ENV === 'production'
      ? 'https://geektomato.com'
      : 'http://localhost:9002');

  const resetLink = `${origin}/qun/resetPass?token=${encodeURIComponent(
    token
  )}`;

  await sendResetPasswordMail(user.email, resetLink);

  return {
    code: 0,
    msg: '如果该账号存在且绑定了邮箱，我们已发送重置密码邮件'
  };
});


