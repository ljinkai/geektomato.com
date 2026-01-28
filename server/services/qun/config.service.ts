import { ConfigRepository } from '../../repositories/config.repository';

export class QunConfigService {
  private repo = new ConfigRepository();

  /**
   * 返回 `/qun/config` 需要的配置结构
   * 这里先直接返回 key-value 列表，后续可按旧系统的 JSON 结构做组装。
   */
  async getConfig() {
    const all = this.repo.findAll();
    const data: Record<string, unknown> = {};
    for (const row of all) {
      try {
        data[row.key] = JSON.parse(row.value);
      } catch {
        data[row.key] = row.value;
      }
    }
    return data;
  }
}


