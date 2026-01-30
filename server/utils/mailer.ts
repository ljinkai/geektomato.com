import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT
  ? Number(process.env.SMTP_PORT)
  : 587;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.MAIL_FROM || user;

const transporter =
  host && user && pass
    ? nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass
        }
      })
    : null;

export async function sendResetPasswordMail(
  to: string,
  resetLink: string
): Promise<void> {
  if (!transporter || !from) {
    console.warn(
      '[mailer] SMTP 未配置，重置链接：',
      resetLink,
      '，目标邮箱：',
      to
    );
    return;
  }

  const subject = '群合影账号密码重置';
  const text = `您好，

我们收到了您重置密码的请求。如果是您本人操作，请点击下面的链接在 30 分钟内完成密码重置：

${resetLink}

如果这不是您的操作，请忽略本邮件，您的账户密码不会被修改。

—— geektomato / 群合影`;

  const html = `<p>您好，</p>
<p>我们收到了您重置密码的请求。如果是您本人操作，请在 <strong>30 分钟</strong> 内点击下面的链接完成密码重置：</p>
<p><a href="${resetLink}">${resetLink}</a></p>
<p>如果这不是您的操作，请忽略本邮件，您的账户密码不会被修改。</p>
<p>—— 群合影</p>`;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
}

