import { ConfigRepository } from '../../repositories/config.repository';
import { ThemeRepository } from '../../repositories/theme.repository';

export class QunConfigService {
  private configRepo = new ConfigRepository();
  private themeRepo = new ThemeRepository();

  /**
   * 返回 `/qun/config` 需要的配置结构
   * 格式：{ theme: [{ url, vip }], config: { key: value } }
   */
  async getConfig() {
    // 获取启用的主题
    const themes = this.themeRepo.findEnabled();
    const themeList = themes.map((t) => ({
      url: t.url,
      vip: t.vip
    }));

    // 获取配置
    const configRows = this.configRepo.findAll();
    const config: Record<string, unknown> = {};
    for (const row of configRows) {
      try {
        config[row.key] = JSON.parse(row.value);
      } catch {
        config[row.key] = row.value;
      }
    }

    return {
      theme: themeList,
      config
    };
  }
}


