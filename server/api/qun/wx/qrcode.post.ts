import { QunPayService } from '../../../services/qun/pay.service';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    order_id: string;
    amount: number;
  }>(event);

  if (!body?.order_id || typeof body.amount !== 'number') {
    return { code: 400, msg: '缺少 order_id 或 amount' };
  }

  const service = new QunPayService();
  const result = await service.createWxQrcode({
    orderId: body.order_id,
    amount: body.amount
  });

  return {
    code: 0,
    msg: 'ok',
    data: result
  };
});


