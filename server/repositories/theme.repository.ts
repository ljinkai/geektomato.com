import { getDb } from '../db/client';
import { THEMES_TABLE, ThemeRow } from '../db/schema/theme.schema';

export class ThemeRepository {
  private db = getDb();

  /**
   * 查询所有启用的主题，按 order 排序
   */
  findEnabled(): ThemeRow[] {
    const stmt = this.db.prepare<ThemeRow>(
      `SELECT * FROM ${THEMES_TABLE}
       WHERE state = 1
       ORDER BY \`order\` ASC, id ASC`
    );
    return stmt.all() as ThemeRow[];
  }
}
