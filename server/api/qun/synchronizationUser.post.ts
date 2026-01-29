import { QunUserService } from '../../services/qun/user.service';
import { verifyToken } from '../../utils/jws';
import { getDb } from '../../db/client';
import { USERS_TABLE } from '../../db/schema/users.schema';

export default defineEventHandler(async (event) => {
  const body = await readBody<
    {
      // 旧接口格式：带 qunheying_header（URL 编码的 JSON 字符串）
      qunheying_header?: string;
    } & {
      // 新接口格式：直接传用户信息
      username?: string;
      mobilePhoneNumber?: string;
      email?: string;
      password?: string;
      nickName?: string;
    }
  >(event);

  /**
   * 1. 兼容旧接口：qunheying_header 格式
   *
   * 原始请求示例：
   * {
   *   "qunheying_header":"%7B%22userId%22%3A%22l1%22%2C%22userName%22%3A%22lname_1%22%2C%22token%22%3A\"...\"%7D"
   * }
   */
  if (body.qunheying_header) {
    try {
      const decoded = decodeURIComponent(body.qunheying_header);
      const header = JSON.parse(decoded) as {
        userId: string;
        userName: string;
        token: string;
      };

      // 验证 token
      const tokenPayload = await verifyToken(header.token);

      // 根据用户信息查询本地用户
      const db = getDb();
      const stmt = db.prepare<{
        id: number;
        username: string | null;
        nick_name: string;
        expiration_at: string | null;
      }>(
        `SELECT id, username, nick_name, expiration_at
         FROM ${USERS_TABLE}
         WHERE username = ? LIMIT 1`
      );
      const user = stmt.get(header.userId) as
        | {
            id: number;
            username: string | null;
            nick_name: string;
            expiration_at: string | null;
          }
        | undefined;

      let verifed = 0;
      let expirationAt: string | null = null;

      if (user && user.expiration_at) {
        expirationAt = user.expiration_at;
        const now = new Date();
        const expDate = new Date(expirationAt);
        if (expDate.getTime() > now.getTime()) {
          verifed = 1;
        }
      }

      // 返回结构尽量兼容旧系统：{ success: true, data: { verifed, expirationAt, userId, userName, token } }
      return {
        success: true,
        data: {
          verifed,
          expirationAt,
          userId: header.userId,
          userName: header.userName,
          token: header.token
        }
      };
    } catch (err) {
      return {
        success: false,
        data: {
          err: 'invalid_qunheying_header'
        }
      };
    }
  }

  /**
   * 2. 新接口格式：直接同步/创建用户
   */
  if (!body?.mobilePhoneNumber && !body?.email && !body?.username) {
    return { code: 400, msg: '缺少用户唯一标识（username/mobilePhoneNumber/email)' };
  }

  const service = new QunUserService();

  // 如果能登录说明已存在，否则按提供的信息创建
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


