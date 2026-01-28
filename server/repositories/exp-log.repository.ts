import { getDb } from '../db/client';
import { EXP_LOGS_TABLE, ExpLogRow } from '../db/schema/exp_logs.schema';

export class ExpLogRepository {
  private db = getDb();

  insert(userId: number, delta: number, reason?: string) {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      `INSERT INTO ${EXP_LOGS_TABLE} (user_id, delta, reason, created_at)
       VALUES (?, ?, ?, ?)`
    );
    stmt.run(userId, delta, reason ?? null, now);
  }

  findByUserId(userId: number, limit = 50): ExpLogRow[] {
    const stmt = this.db.prepare<ExpLogRow>(
      `SELECT * FROM ${EXP_LOGS_TABLE}
       WHERE user_id = ?
       ORDER BY id DESC
       LIMIT ?`
    );
    return stmt.all(userId, limit) as ExpLogRow[];
  }
}


