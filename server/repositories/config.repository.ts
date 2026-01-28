import { getDb } from '../db/client';
import { QUN_CONFIG_TABLE, QunConfigRow } from '../db/schema/config.schema';

export class ConfigRepository {
  private db = getDb();

  findByKey(key: string): QunConfigRow | undefined {
    const stmt = this.db.prepare<QunConfigRow>(
      `SELECT * FROM ${QUN_CONFIG_TABLE} WHERE key = ? LIMIT 1`
    );
    return stmt.get(key) as QunConfigRow | undefined;
  }

  findAll(): QunConfigRow[] {
    const stmt = this.db.prepare<QunConfigRow>(
      `SELECT * FROM ${QUN_CONFIG_TABLE}`
    );
    return stmt.all() as QunConfigRow[];
  }
}


