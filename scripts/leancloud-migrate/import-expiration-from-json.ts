import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { getDb } from '../../server/db/client';
import { initDb } from '../../server/db/init';
import { USERS_TABLE } from '../../server/db/schema/users.schema';

/**
 * 从 db/data/Expiration.0.jsonl 导入过期信息到 users 表
 *
 * 策略：直接更新 users 表的 expiration_at 字段
 * - 通过 userObjectId 匹配 users.lc_object_id
 * - 更新 expiration_at 和 session_token（如果 Expiration 中的更新）
 */
interface LeanCloudExpiration {
  objectId: string;
  userObjectId: string;
  username: string;
  expirationAt?: { __type: 'Date'; iso: string };
  sessionToken?: string;
  Bot?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 解析 LeanCloud Date 对象为 ISO 字符串
 */
function parseDate(dateValue: unknown): string | null {
  if (!dateValue) return null;
  if (typeof dateValue === 'string') return dateValue;
  if (typeof dateValue === 'object' && dateValue !== null) {
    const obj = dateValue as { __type?: string; iso?: string };
    if (obj.__type === 'Date' && obj.iso) {
      return obj.iso;
    }
  }
  return null;
}

export async function importExpirationFromJson() {
  // 确保数据库表已创建
  initDb();

  const db = getDb();
  const filePath = path.resolve(process.cwd(), 'db/data/Expiration.0.jsonl');

  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }

  // 先读取所有行到内存
  const lines: string[] = [];
  const fileStream = fs.createReadStream(filePath, 'utf-8');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    lines.push(line);
  }

  // 准备更新语句：更新 expiration_at 和 session_token
  const updateExpiration = db.prepare(
    `UPDATE ${USERS_TABLE}
     SET expiration_at = ?,
         session_token = COALESCE(?, session_token),
         updated_at = ?
     WHERE lc_object_id = ?`
  );

  let updatedCount = 0;
  let skippedCount = 0;
  const errors: Array<{ line: number; error: string; objectId?: string }> = [];

  const tx = db.transaction(() => {
    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // 跳过第一行的文件类型声明
      if (lineNumber === 1 && line.startsWith('#filetype:')) {
        return;
      }

      // 跳过空行
      if (!line.trim()) {
        return;
      }

      try {
        const exp: LeanCloudExpiration = JSON.parse(line);

        // 验证必需字段
        if (!exp.userObjectId) {
          errors.push({
            line: lineNumber,
            error: '缺少 userObjectId',
            objectId: exp.objectId,
          });
          skippedCount++;
          return;
        }

        // 检查用户是否存在
        const checkUser = db
          .prepare(`SELECT id FROM ${USERS_TABLE} WHERE lc_object_id = ?`)
          .get(exp.userObjectId) as { id: number } | undefined;

        if (!checkUser) {
          errors.push({
            line: lineNumber,
            error: `用户不存在 (userObjectId: ${exp.userObjectId})`,
            objectId: exp.objectId,
          });
          skippedCount++;
          return;
        }

        // 执行更新
        const expirationAt = parseDate(exp.expirationAt);
        const result = updateExpiration.run(
          expirationAt,
          exp.sessionToken ?? null,
          exp.updatedAt || new Date().toISOString(),
          exp.userObjectId
        );

        if (result.changes > 0) {
          updatedCount++;
        } else {
          // 可能是没有变化（expiration_at 已经是相同值）
          updatedCount++;
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : String(err);
        errors.push({
          line: lineNumber,
          error: `解析失败: ${errorMsg}`,
        });
        skippedCount++;
      }
    });
  });

  // 执行事务
  tx();

  // 输出结果
  // eslint-disable-next-line no-console
  console.log(`\n导入 Expiration 完成:`);
  // eslint-disable-next-line no-console
  console.log(`  ✓ 成功更新: ${updatedCount} 条`);
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

  return { updatedCount, skippedCount, errors };
}

if (require.main === module) {
  importExpirationFromJson().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}
