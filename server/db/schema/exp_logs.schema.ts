// 经验日志表 `exp_logs`

export const EXP_LOGS_TABLE = 'exp_logs';

export interface ExpLogRow {
  id: number;
  user_id: number;
  delta: number;
  reason: string | null;
  created_at: string;
}

export const createExpLogsTableSQL = `
CREATE TABLE IF NOT EXISTS ${EXP_LOGS_TABLE} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  delta INTEGER NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL
);
`;


