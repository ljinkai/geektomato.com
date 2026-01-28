// LeanCloud `qun_orders` → 本地 `orders` 表

export const ORDERS_TABLE = 'orders';

export interface OrderRow {
  id: number;
  lc_object_id: string;
  user_lc_id: string;
  user_id: number | null;
  qr_id: string;
  charge_id: string;
  order_id: string;
  amount: number;
  day: string;
  payway: string;
  state: string | null;
  refund_state: string | null;
  refund_amount: number | null;
  description: string | null;
  create_time_raw: string;
  created_at: string | null;
  updated_at: string | null;
}

export const createOrdersTableSQL = `
CREATE TABLE IF NOT EXISTS ${ORDERS_TABLE} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lc_object_id TEXT NOT NULL UNIQUE,
  user_lc_id TEXT NOT NULL,
  user_id INTEGER,
  qr_id TEXT NOT NULL,
  charge_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  day TEXT NOT NULL,
  payway TEXT NOT NULL,
  state TEXT,
  refund_state TEXT,
  refund_amount INTEGER,
  description TEXT,
  create_time_raw TEXT NOT NULL,
  created_at TEXT,
  updated_at TEXT
);
`;


