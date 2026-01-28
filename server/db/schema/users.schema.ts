// LeanCloud `_User` → 本地 `users` 表

export const USERS_TABLE = 'users';

export interface UserRow {
  id: number;
  lc_object_id: string;
  username: string | null;
  password_hash: string;
  salt: string | null;
  email: string | null;
  email_verified: number; // 0/1
  mobile_phone_number: string | null;
  mobile_phone_verified: number; // 0/1
  nick_name: string;
  apply_at: string | null; // ISO datetime
  expiration_at: string | null;
  session_token: string | null;
  auth_data: string | null; // JSON
  status: number;
  exp: number;
  created_at: string;
  updated_at: string;
}

export const createUsersTableSQL = `
CREATE TABLE IF NOT EXISTS ${USERS_TABLE} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lc_object_id TEXT NOT NULL UNIQUE,
  username TEXT,
  password_hash TEXT NOT NULL,
  salt TEXT,
  email TEXT,
  email_verified INTEGER DEFAULT 0,
  mobile_phone_number TEXT,
  mobile_phone_verified INTEGER DEFAULT 0,
  nick_name TEXT NOT NULL,
  apply_at TEXT,
  expiration_at TEXT,
  session_token TEXT,
  auth_data TEXT,
  status INTEGER DEFAULT 1,
  exp INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`;


