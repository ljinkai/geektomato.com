import { getDb } from '../../db/client';
import { USERS_TABLE } from '../../db/schema/users.schema';
import { ExpLogRepository } from '../../repositories/exp-log.repository';

export default defineEventHandler((event) => {
  const query = getQuery(event) as { userId?: string };
  if (!query.userId) {
    return { code: 400, msg: '缺少 userId' };
  }
  const userId = Number(query.userId);
  if (!Number.isFinite(userId)) {
    return { code: 400, msg: 'userId 非数字' };
  }

  const db = getDb();
  const userStmt = db.prepare(
    `SELECT id, exp, nick_name FROM ${USERS_TABLE} WHERE id = ?`
  );
  const user = userStmt.get(userId) as
    | { id: number; exp: number; nick_name: string }
    | undefined;
  if (!user) {
    return { code: 404, msg: '用户不存在' };
  }

  const logsRepo = new ExpLogRepository();
  const logs = logsRepo.findByUserId(userId, 20);

  return {
    code: 0,
    msg: 'ok',
    data: {
      user,
      logs
    }
  };
});


