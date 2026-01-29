import { getDb } from './client';
import { createUsersTableSQL } from './schema/users.schema';
import { createOrdersTableSQL } from './schema/orders.schema';
import { createExpLogsTableSQL } from './schema/exp_logs.schema';
import { createQunConfigTableSQL } from './schema/config.schema';
import { createThemesTableSQL } from './schema/theme.schema';

/**
 * 在服务启动时初始化 SQLite 表结构（如不存在则创建）
 */
export function initDb() {
  const db = getDb();
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(createUsersTableSQL);
  db.exec(createOrdersTableSQL);
  db.exec(createExpLogsTableSQL);
  db.exec(createQunConfigTableSQL);
  db.exec(createThemesTableSQL);
}


