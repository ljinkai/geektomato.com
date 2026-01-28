import { OrderRepository } from '../../repositories/order.repository';

export class QunOrderService {
  private repo = new OrderRepository();

  async getOrderState(orderId: string) {
    const order = this.repo.findByOrderId(orderId);
    if (!order) return null;
    return {
      order_id: order.order_id,
      state: order.state,
      amount: order.amount,
      day: order.day,
      payway: order.payway,
      refund_state: order.refund_state,
      refund_amount: order.refund_amount,
      created_at: order.created_at,
      updated_at: order.updated_at
    };
  }
}


