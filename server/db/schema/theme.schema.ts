// LeanCloud `theme` → 本地 `themes` 表

export const THEMES_TABLE = 'themes';

export interface ThemeRow {
  id: number;
  lc_object_id: string;
  state: number; // 0 不启用, 1 启用
  vip: number; // 0 非VIP, 1 VIP
  url: string;
  order: number; // 排序
  created_at: string | null;
  updated_at: string | null;
}

export const createThemesTableSQL = `
CREATE TABLE IF NOT EXISTS ${THEMES_TABLE} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lc_object_id TEXT NOT NULL UNIQUE,
  state INTEGER NOT NULL DEFAULT 0,
  vip INTEGER NOT NULL DEFAULT 0,
  url TEXT NOT NULL,
  \`order\` INTEGER NOT NULL DEFAULT 0,
  created_at TEXT,
  updated_at TEXT
);
`;
