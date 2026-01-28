// LeanCloud `config` → 本地 `qun_config` 表

export const QUN_CONFIG_TABLE = 'qun_config';

export interface QunConfigRow {
  id: number;
  lc_object_id: string | null;
  key: string;
  value: string;
  created_at: string | null;
  updated_at: string | null;
}

export const createQunConfigTableSQL = `
CREATE TABLE IF NOT EXISTS ${QUN_CONFIG_TABLE} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lc_object_id TEXT UNIQUE,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TEXT,
  updated_at TEXT
);
`;


