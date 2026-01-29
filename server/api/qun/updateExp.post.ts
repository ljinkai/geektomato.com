import { getDb } from '../../db/client';
import { USERS_TABLE, UserRow } from '../../db/schema/users.schema';
import { UserRepository } from '../../repositories/user.repository';
import { QunUserService } from '../../services/qun/user.service';
import { QunExpService } from '../../services/qun/exp.service';

type OldAdminBody = {
  userName?: string;
  password?: string;
  day?: string;
  overlay?: boolean;
};

type NewApiBody = {
  userId?: number;
  delta?: number;
  reason?: string;
};

export default defineEventHandler(async (event) => {
  const body = (await readBody<OldAdminBody & NewApiBody>(event)) || {};

  // 1. 兼容旧后台页面：根据用户名 + 密码 + 天数，更新会员过期时间（expiration_at）
  if (body.userName && body.password == "qunQ1" && body.day) {
    const userRepo = new UserRepository();
    const user = userRepo.findByUsername(body.userName);

    if (!user) {
      return {
        success: false,
        data: {
          err_code: 1000,
          err_msg: {
            code: 404,
            rawMessage: '用户不存在'
          }
        }
      };
    }


    const daysMap: Record<string, number> = {
      '1': 1,
      '3': 3,
      '7': 7,
      '30': 30,
      '31': 31,
      '91': 91,
      '183': 183,
      '365': 365
    };

    const dayNumber = daysMap[body.day];
    if (!dayNumber) {
      return {
        success: false,
        data: {
          err_code: 1000,
          err_msg: {
            code: 400,
            rawMessage: '无效的天数参数'
          }
        }
      };
    }

    // 计算新的过期时间：按 overlay 决定是叠加还是从现在开始
    const now = new Date();
    let baseTime = now.getTime();

    if (body.overlay && user.expiration_at) {
      const prev = Date.parse(user.expiration_at);
      if (!Number.isNaN(prev)) {
        baseTime = prev;
      }
    }

    const newExpiration = new Date(baseTime + dayNumber * 24 * 60 * 60 * 1000);
    const newExpirationIso = newExpiration.toISOString();

    const db = getDb();
    const stmt = db.prepare(
      `UPDATE ${USERS_TABLE}
       SET expiration_at = ?, updated_at = ?
       WHERE id = ?`
    );
    stmt.run(newExpirationIso, new Date().toISOString(), user.id);

    // 返回与旧接口风格一致的结构
    return {
      success: true,
      data: {
        expirationAt: newExpirationIso
      }
    };
  }

  // 2. 新接口：按 userId & delta 更新经验值，并记录日志
  if (typeof body.userId === 'number' && typeof body.delta === 'number') {
    const service = new QunExpService();
    await service.updateExp({
      userId: body.userId,
      delta: body.delta,
      reason: body.reason
    });

    return {
      success: true,
      data: {}
    };
  }

  // 参数不完整
  return {
    success: false,
    data: {
      err_code: 1000,
      err_msg: {
        code: 400,
        rawMessage: '缺少必要参数'
      }
    }
  };
});

