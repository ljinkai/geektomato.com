import { OrderRepository } from '../../../repositories/order.repository';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    charge_id: string;
    order_id: string;
    amount: number;
    state?: string;
    refund_state?: string;
    refund_amount?: number;
    description?: string;
  }>(event);

  if (!body?.charge_id || !body.order_id || typeof body.amount !== 'number') {
    return { code: 400, msg: '缺少 charge_id / order_id / amount' };
  }

  const repo = new OrderRepository();
  // 目前只更新状态，不做创建逻辑；真实场景中建议提前创建订单
  const state = body.state ?? 'paid';
  repo.updateStateByChargeId(body.charge_id, state);

  return {
    code: 0,
    msg: 'ok'
  };
});


