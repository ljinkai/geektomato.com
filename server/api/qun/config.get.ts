import { QunConfigService } from '../../services/qun/config.service';

export default defineEventHandler(async () => {
  const service = new QunConfigService();
  const data = await service.getConfig();
  return {
    code: 0,
    msg: 'ok',
    data
  };
});


