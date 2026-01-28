import { QunExpService } from '../../services/qun/exp.service';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    userId: number;
    delta: number;
    reason?: string;
  }>(event);

  if (!body || typeof body.userId !== 'number' || typeof body.delta !== 'number') {
    return { code: 400, msg: '缺少 userId 或 delta' };
  }

  const service = new QunExpService();
  await service.updateExp({
    userId: body.userId,
    delta: body.delta,
    reason: body.reason
  });

  return {
    code: 0,
    msg: 'ok'
  };
});


