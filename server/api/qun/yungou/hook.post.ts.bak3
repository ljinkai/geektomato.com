import { OrderRepository } from '../../../repositories/order.repository';
import crypto from 'node:crypto';
import { UserRepository } from '../../../repositories/user.repository';

/**
 * Yungouos 支付回调接口
 * 兼容两种格式：
 * 1. Yungouos 回调格式（旧格式，参考 v1 实现）
 * 2. 新格式（charge_id, order_id, amount）
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<any>(event);

  // 判断是否为 Yungouos 格式（包含 outTradeNo）
  if (body.outTradeNo) {
    return handleYungouosFormat(body);
  }

  // 新格式处理
  if (!body?.charge_id || !body.order_id || typeof body.amount !== 'number') {
    return { code: 400, msg: '缺少 charge_id / order_id / amount' };
  }

  const repo = new OrderRepository();
  const state = body.state ?? 'paid';
  repo.updateStateByChargeId(body.charge_id, state);

  return {
    code: 0,
    msg: 'ok'
  };
});

/**
 * 处理 Yungouos 格式的回调（参考 v1 实现）
 */
async function handleYungouosFormat(params: {
  code: string;
  mchId: string;
  orderNo: string;
  payNo: string;
  outTradeNo: string;
  money: string;
  sign: string;
  attach?: string;
  payChannel?: string;
  payBank?: string;
  time?: string;
}) {
  const orderRepo = new OrderRepository();
  const userRepo = new UserRepository();

  const tradNo = params.outTradeNo;
  if (!tradNo) {
    return { code: 400, msg: '缺少 outTradeNo' };
  }

  console.log('Yungouos hook params:', params);

  // 验证签名
  const signValue = params.sign;
  const transParams = {
    code: params.code,
    orderNo: params.orderNo,
    payNo: params.payNo,
    outTradeNo: params.outTradeNo,
    money: params.money,
    mchId: params.mchId
  };

  // 使用 QunPayService 的 sign 方法（需要访问私有方法，这里直接实现）
  const yungouosKey = process.env.YUNGOUOS_KEY || '';
  const calculatedSign = calculateSign(transParams, yungouosKey);

  if (calculatedSign !== signValue) {
    console.error('签名验证失败:', { calculated: calculatedSign, received: signValue });
    return { code: 400, msg: '签名验证失败' };
  }

  // 检查订单是否已存在
  const existingOrder = orderRepo.findByOrderId(tradNo);
  if (existingOrder && existingOrder.charge_id) {
    console.log('订单已存在:', existingOrder);
    return 'SUCCESS';
  }

  // 解析 attach 参数：格式为 "用户名,随机ID,天数"
  if (!params.attach) {
    return { code: 400, msg: '缺少 attach 参数' };
  }

  const attachParts = params.attach.split(',');
  if (attachParts.length !== 3) {
    return { code: 400, msg: 'attach 参数格式错误，应为：用户名,随机ID,天数' };
  }

  const [username, qrId, day] = attachParts;

  // 查找用户
  const user = userRepo.findByUsername(username);
  if (!user) {
    console.error(`用户不存在: ${username}`);
    return { code: 404, msg: `用户不存在: ${username}` };
  }

  // 创建订单
  // 注意：这里需要生成 lc_object_id，但新版本可能不需要，使用空字符串或时间戳
  const lcObjectId = `yungou_${Date.now()}_${tradNo}`;
  const order = orderRepo.create({
    lc_object_id: lcObjectId,
    user_lc_id: user.lc_object_id || '',
    user_id: user.id,
    qr_id: qrId,
    charge_id: params.orderNo, // Yungouos 的 orderNo 对应 charge_id
    order_id: tradNo,
    amount: Math.round(parseFloat(params.money) * 100), // 转换为分
    day: day,
    payway: params.payChannel || 'wxpay',
    state: params.code,
    description: params.payBank || null,
    create_time_raw: params.time || new Date().toISOString()
  });

  console.log('创建订单:', order);

  // 更新用户会员过期时间
  const success = userRepo.updateExpirationByDays(username, parseInt(day));
  if (!success) {
    console.error(`更新用户会员时间失败: ${username}, 天数: ${day}`);
  } else {
    console.log(`更新用户会员时间成功: ${username}, 天数: ${day}`);
  }

  // TODO: 发送微信通知（如果需要）
  // await notificationToWX(order);

  return 'SUCCESS';
}

/**
 * 计算签名（与 QunPayService 保持一致）
 */
function calculateSign(transParams: Record<string, any>, key: string): string {
  const paramsArr = Object.keys(transParams).sort();
  const stringArr: string[] = [];
  
  paramsArr.forEach((paramKey) => {
    stringArr.push(`${paramKey}=${transParams[paramKey]}`);
  });
  
  stringArr.push(`key=${key}`);
  const str = stringArr.join('&');
  
  
  return crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase();
}