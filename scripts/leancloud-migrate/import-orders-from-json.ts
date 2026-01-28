import fs from 'node:fs';
import path from 'node:path';
import { getDb } from '../../server/db/client';
import { ORDERS_TABLE } from '../../server/db/schema/orders.schema';

export async function importOrdersFromJson() {
  const db = getDb();
  const filePath = path.resolve(process.cwd(), 'db/0128/qun_orders_all.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw) as { results: any[] }; // eslint-disable-line @typescript-eslint/no-explicit-any

  const insert = db.prepare(
    `INSERT OR IGNORE INTO ${ORDERS_TABLE}
      (lc_object_id, user_lc_id, qr_id, charge_id, order_id, amount, day, payway, state, refund_state, refund_amount, description, create_time_raw)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const tx = db.transaction(() => {
    for (const o of json.results) {
      insert.run(
        o.objectId,
        o.user_id,
        o.qr_id,
        o.charge_id,
        o.order_id,
        Number(o.amount ?? 0),
        o.day,
        o.payway,
        o.state ?? null,
        o.refund_state ?? null,
        o.refund_amount ? Number(o.refund_amount) : null,
        o.description ?? null,
        o.create_time
      );
    }
  });

  tx();
  // eslint-disable-next-line no-console
  console.log(`Imported ${json.results.length} orders into ${ORDERS_TABLE}`);
}

if (require.main === module) {
  importOrdersFromJson().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}


