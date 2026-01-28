import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

/**
 * SQLite 单例客户端
 *
 * - 默认使用项目根目录下的 `data/qun.sqlite`
 * - 在 Nuxt 3/4 中可直接在 server 端引入使用
 */
let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    const dbPath =
      process.env.QUN_SQLITE_PATH ||
      // 相对当前文件：../../data/qun.sqlite
      new URL('../../data/qun.sqlite', import.meta.url).pathname;

    // 确保目录存在
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db!;
}

export type Db = ReturnType<typeof getDb>;


