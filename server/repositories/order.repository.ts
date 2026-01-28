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
}


