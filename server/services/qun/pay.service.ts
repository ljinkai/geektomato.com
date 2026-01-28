/**
 * 支付相关逻辑（微信二维码等）
 *
 * 由于当前项目还未接入真实的支付 SDK，这里先返回一个占位的二维码 URL，
 * 后续可以在此处对接微信支付 / 第三方支付平台。
 */
export class QunPayService {
  async createWxQrcode(payload: {
    orderId: string;
    amount: number;
  }) {
    // TODO: 对接真实支付平台，生成二维码链接或 base64
    const mockUrl = `weixin://q/mock-${payload.orderId}`;
    return {
      order_id: payload.orderId,
      amount: payload.amount,
      qr_url: mockUrl
    };
  }
}


