import { QunOrderService } from '../../services/qun/order.service';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ order_id: string }>(event);

  if (!body?.order_id) {
    return { code: 400, msg: '缺少 order_id' };
  }

  const service = new QunOrderService();
  const state = await service.getOrderState(body.order_id);
  if (!state) {
    return { code: 404, msg: '订单不存在' };
  }

  return {
    code: 0,
    msg: 'ok',
    data: state
  };
});


