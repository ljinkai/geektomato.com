import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { getDb } from '../../server/db/client';
import { initDb } from '../../server/db/init';
import { THEMES_TABLE } from '../../server/db/schema/theme.schema';

/**
 * 从 db/data/theme.0.jsonl 导入主题到 SQLite
 *
 * JSONL 格式说明：
 * - 第一行：`#filetype:JSON-streaming {"type":"Class","class":"theme"}`
 * - 后续每行：一个完整的 JSON 对象
 */
interface LeanCloudTheme {
  objectId: string;
  state: number; // 0 不启用, 1 启用
  vip: number; // 0 非VIP, 1 VIP
  url: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export async function importThemeFromJson() {
  // 确保数据库表已创建
  initDb();

  const db = getDb();
  const filePath = path.resolve(process.cwd(), 'db/data/theme.0.jsonl');

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

  const insert = db.prepare(
    `INSERT OR IGNORE INTO ${THEMES_TABLE}
      (lc_object_id, state, vip, url, \`order\`, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  let importedCount = 0;
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
        const theme: LeanCloudTheme = JSON.parse(line);

        // 验证必需字段
        if (!theme.objectId) {
          errors.push({ line: lineNumber, error: '缺少 objectId' });
          skippedCount++;
          return;
        }

        if (!theme.url) {
          errors.push({
            line: lineNumber,
            error: '缺少 url',
            objectId: theme.objectId,
          });
          skippedCount++;
          return;
        }

        // 执行插入
        insert.run(
          theme.objectId,
          theme.state ?? 0,
          theme.vip ?? 0,
          theme.url,
          theme.order ?? 0,
          theme.createdAt || new Date().toISOString(),
          theme.updatedAt || new Date().toISOString()
        );

        importedCount++;
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
  console.log(`\n导入 theme 完成:`);
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
  importThemeFromJson().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}
