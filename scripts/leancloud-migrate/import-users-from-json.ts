import fs from 'node:fs';
import path from 'node:path';
import { getDb } from '../../server/db/client';
import { USERS_TABLE } from '../../server/db/schema/users.schema';

/**
 * 从 db/0128/_User_all.json 导入用户到 SQLite
 *
 * 说明：
 * - 这是一个骨架脚本，只演示大致结构，未完全实现字段映射与错误处理。
 * - 真正执行前，请根据实际数据结构补充映射和测试。
 */
export async function importUsersFromJson() {
  const db = getDb();
  const filePath = path.resolve(process.cwd(), 'db/0128/_User_all.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw) as { results: any[] }; // eslint-disable-line @typescript-eslint/no-explicit-any

  const insert = db.prepare(
    `INSERT OR IGNORE INTO ${USERS_TABLE}
      (lc_object_id, username, email, password_hash, salt, nick_name, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const tx = db.transaction(() => {
    for (const u of json.results) {
      insert.run(
        u.objectId,
        u.username ?? null,
        u.email ?? null,
        u.password ?? '',
        u.salt ?? null,
        u.nickName ?? '',
        u.createdAt ?? new Date().toISOString(),
        u.updatedAt ?? new Date().toISOString()
      );
    }
  });

  tx();
  // eslint-disable-next-line no-console
  console.log(`Imported ${json.results.length} users into ${USERS_TABLE}`);
}

if (require.main === module) {
  importUsersFromJson().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}


