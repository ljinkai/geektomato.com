import { getDb } from '../db/client';
import { ORDERS_TABLE, OrderRow } from '../db/schema/orders.schema';

export class OrderRepository {
  private db = getDb();

  findByOrderId(orderId: string): OrderRow | undefined {
    const stmt = this.db.prepare<OrderRow>(
      `SELECT * FROM ${ORDERS_TABLE} WHERE order_id = ? LIMIT 1`
    );
    return stmt.get(orderId) as OrderRow | undefined;
  }

  updateStateByChargeId(chargeId: string, state: string) {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      `UPDATE ${ORDERS_TABLE}
       SET state = ?, updated_at = ?
       WHERE charge_id = ?`
    );
    stmt.run(state, now, chargeId);
  }

  findByChargeId(chargeId: string): OrderRow | undefined {
    const stmt = this.db.prepare<OrderRow>(
      `SELECT * FROM ${ORDERS_TABLE} WHERE charge_id = ? LIMIT 1`
    );
    return stmt.get(chargeId) as OrderRow | undefined;
  }

  create(input: {
    lc_object_id: string;
    user_lc_id: string;
    user_id: number | null;
    qr_id: string;
    charge_id: string;
    order_id: string;
    amount: number;
    day: string;
    payway: string;
    state: string;
    description: string | null;
    create_time_raw: string;
  }): OrderRow {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      `INSERT INTO ${ORDERS_TABLE}
       (lc_object_id, user_lc_id, user_id, qr_id, charge_id, order_id, amount, day, payway, state, description, create_time_raw, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const info = stmt.run(
      input.lc_object_id,
      input.user_lc_id,
      input.user_id,
      input.qr_id,
      input.charge_id,
      input.order_id,
      input.amount,
      input.day,
      input.payway,
      input.state,
      input.description,
      input.create_time_raw,
      now,
      now
    );

    const id = Number(info.lastInsertRowid);
    const rowStmt = this.db.prepare<OrderRow>(
      `SELECT * FROM ${ORDERS_TABLE} WHERE id = ?`
    );
    return rowStmt.get(id) as OrderRow;
  }
}


