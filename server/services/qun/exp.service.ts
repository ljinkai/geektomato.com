import { getDb } from '../../db/client';
import { UserRepository } from '../../repositories/user.repository';
import { ExpLogRepository } from '../../repositories/exp-log.repository';

export class QunExpService {
  private db = getDb();
  private users = new UserRepository();
  private expLogs = new ExpLogRepository();

  /**
   * 更新用户经验，并记录日志（事务内完成）
   */
  async updateExp(options: {
    userId: number;
    delta: number;
    reason?: string;
  }) {
    const tx = this.db.transaction(() => {
      this.users.updateExp(options.userId, options.delta);
      this.expLogs.insert(options.userId, options.delta, options.reason);
    });
    tx();
  }
}


