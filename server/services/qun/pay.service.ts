import crypto from 'node:crypto';

/**
 * 支付相关逻辑（微信二维码等）
 * 对接 yungouos 支付平台
 */
export class QunPayService {
  private readonly yungouosKey = process.env.YUNGOUOS_KEY || '';
  private readonly mchId = process.env.YUNGOUOS_MCH_ID || '';
  private readonly notifyUrl = process.env.YUNGOUOS_NOTIFY_URL || '';

  /**
   * 生成签名（MD5）
   */
  private sign(transParams: Record<string, any>, key: string): string {
    const paramsArr = Object.keys(transParams).sort();
    const stringArr: string[] = [];
    
    paramsArr.forEach((paramKey) => {
      stringArr.push(`${paramKey}=${transParams[paramKey]}`);
    });
    
    stringArr.push(`key=${key}`);
    const str = stringArr.join('&');
    
    return crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase();
  }

  /**
   * 创建微信支付二维码
   */
  async createWxQrcode(payload: {
    name: string;
    fee: number;
    attach: string;
  }) {
    // 生成订单号：qun + 时间戳
    const dateTime = Date.now();
    const outTradeNo = `qun${dateTime}`;

    // 准备签名参数（按字母顺序排序）
    const transParams: Record<string, any> = {
      out_trade_no: outTradeNo,
      total_fee: payload.fee,
      mch_id: this.mchId,
      body: payload.name
    };

    // 生成签名
    const signValue = this.sign(transParams, this.yungouosKey);
    
    // 添加签名和其他参数
    transParams.sign = signValue;
    transParams.notify_url = this.notifyUrl;
    transParams.attach = payload.attach;

    // 调用 yungouos API
    const url = 'https://api.pay.yungouos.com/api/pay/wxpay/nativePay';
    
    try {
      // yungouos 可能接受 form-data 格式，使用 URLSearchParams
      const formData = new URLSearchParams();
      Object.keys(transParams).forEach((key) => {
        formData.append(key, String(transParams[key]));
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      const result = await response.json();
      
      // 返回格式兼容旧接口（直接返回 yungouos 的响应）
      return result;
    } catch (error) {
      console.error('[QunPayService] 调用 yungouos API 失败:', error);
      throw error;
    }
  }
}


