import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { getDb } from '../../server/db/client';
import { initDb } from '../../server/db/init';
import { ORDERS_TABLE } from '../../server/db/schema/orders.schema';

interface LeanCloudOrder {
  objectId: string;
  user_id: string;
  qr_id: string;
  charge_id: string;
  order_id: string;
  amount: string;
  day: string;
  payway: string;
  state?: string;
  refund_state?: string;
  refund_amount?: string;
  description?: string;
  create_time: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function importOrdersFromJson() {
  // 确保表结构已初始化
  initDb();

  const db = getDb();
  const filePath = path.resolve(process.cwd(), 'db/data/qun_orders.0.jsonl');

  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }

  const lines: string[] = [];
  const fileStream = fs.createReadStream(filePath, 'utf-8');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    lines.push(line);
  }

  const insert = db.prepare(
    `INSERT OR IGNORE INTO ${ORDERS_TABLE}
      (lc_object_id, user_lc_id, qr_id, charge_id, order_id, amount, day, payway,
       state, refund_state, refund_amount, description, create_time_raw)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  let importedCount = 0;
  let skippedCount = 0;
  const errors: Array<{ line: number; error: string; objectId?: string }> = [];

  const tx = db.transaction(() => {
    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      if (lineNumber === 1 && line.startsWith('#filetype:')) {
        return;
      }
      if (!line.trim()) {
        return;
      }

      try {
        const o: LeanCloudOrder = JSON.parse(line);

        if (!o.objectId || !o.user_id || !o.qr_id || !o.charge_id || !o.order_id) {
          errors.push({
            line: lineNumber,
            error: '缺少关键字段(objectId/user_id/qr_id/charge_id/order_id)',
            objectId: o.objectId,
          });
          skippedCount++;
          return;
        }

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

        importedCount++;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        errors.push({ line: lineNumber, error: `解析失败: ${errorMsg}` });
        skippedCount++;
      }
    });
  });

  tx();

  // eslint-disable-next-line no-console
  console.log(`\n导入 orders 完成:`);
  // eslint-disable-next-line no-console
  console.log(`  ✓ 成功导入: ${importedCount} 条`);
  // eslint-disable-next-line no-console
  console.log(`  ✗ 跳过/失败: ${skippedCount} 条`);

  if (errors.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`\n错误详情 (前10条):`);
    errors.slice(0, 10).forEach((e) => {
      // eslint-disable-next-line no-console
      console.log(`  行 ${e.line}: ${e.error}${e.objectId ? ` (objectId: ${e.objectId})` : ''}`);
    });
    if (errors.length > 10) {
      // eslint-disable-next-line no-console
      console.log(`  ... 还有 ${errors.length - 10} 条错误`);
    }
  }

  return { importedCount, skippedCount, errors };
}

if (require.main === module) {
  importOrdersFromJson().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}


