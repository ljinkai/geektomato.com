import { initDb } from '../db/init';

export default defineNitroPlugin(() => {
  // 在 Nitro 启动时初始化数据库表结构
  initDb();
});


