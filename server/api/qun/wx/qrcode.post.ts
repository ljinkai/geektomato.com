import { QunPayService } from '../../../services/qun/pay.service';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    name?: string;
    fee: number;
    attach: string;
  }>(event);

  if (!body?.fee || typeof body.fee !== 'number') {
    return { code: 400, msg: '缺少 fee 参数' };
  }

  if (!body?.attach) {
    return { code: 400, msg: '缺少 attach 参数' };
  }

  const service = new QunPayService();
  const result = await service.createWxQrcode({
    name: body.name || '群合影会员',
    fee: body.fee,
    attach: body.attach
  });

  return {
    code: 0,
    msg: 'ok',
    data: result
  };
});


