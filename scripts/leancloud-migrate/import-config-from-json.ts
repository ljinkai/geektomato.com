import fs from 'node:fs';
import path from 'node:path';
import { getDb } from '../../server/db/client';
import { QUN_CONFIG_TABLE } from '../../server/db/schema/config.schema';

export async function importConfigFromJson() {
  const db = getDb();
  const filePath = path.resolve(process.cwd(), 'db/0128/config_all.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw) as { results: any[] }; // eslint-disable-line @typescript-eslint/no-explicit-any

  const insert = db.prepare(
    `INSERT OR IGNORE INTO ${QUN_CONFIG_TABLE}
      (lc_object_id, key, value, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`
  );

  const tx = db.transaction(() => {
    for (const c of json.results) {
      insert.run(
        c.objectId,
        c.key,
        c.value,
        c.createdAt ?? new Date().toISOString(),
        c.updatedAt ?? new Date().toISOString()
      );
    }
  });

  tx();
  // eslint-disable-next-line no-console
  console.log(`Imported ${json.results.length} configs into ${QUN_CONFIG_TABLE}`);
}

if (require.main === module) {
  importConfigFromJson().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}


