#!/bin/bash

# 测试 /qun/yungou/hook 接口的 curl 命令
# 注意：此脚本使用示例签名，实际使用时需要正确计算签名

BASE_URL="${BASE_URL:-http://localhost:9002}"

echo "=== 测试：Yungouos 支付回调 Hook ==="
echo ""
echo "提示：此脚本使用示例数据，签名可能不正确"
echo "如需正确签名，请使用 test-yungou-hook.js 脚本"
echo ""
echo "注意："
echo "  - 如果访问的是 v1 服务器 (端口 9002)，使用 Yungouos 格式参数"
echo "  - 如果访问的是 Nuxt 4 服务器 (端口 3000)，可能需要不同的参数格式"
echo ""

# 使用 old_script.md 中的示例数据（Yungouos 回调格式）
echo "=== 测试 1: Yungouos 回调格式（适用于 v1 服务器）==="
curl -sS -X POST "${BASE_URL}/qun/yungou/hook" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "1",
    "mchId": "1635138365",
    "orderNo": "Y18455017807548",
    "openId": "o-_-it_l-Cc2zQxc93z3gKFcvE5A",
    "sign": "E985076D11E251C29F9FB3CFAE5B85F6",
    "payBank": "交通银行（信用卡）",
    "payNo": "4200002980202601307163506101",
    "money": "15.80",
    "outTradeNo": "qun1769769950181",
    "payChannel": "wxpay",
    "attach": "l1,1769769950159-c671xdvl0u9,31",
    "time": "2026-01-30 18:46:31"
  }'

echo ""
echo ""

# 如果访问的是 Nuxt 4 服务器，也测试新格式
if [[ "$BASE_URL" == *"3000"* ]] || [[ "$BASE_URL" == *"localhost"* && "$BASE_URL" != *"9002"* ]]; then
  echo "=== 测试 2: 新版本格式（适用于 Nuxt 4 服务器）==="
  curl -sS -X POST "${BASE_URL}/qun/yungou/hook" \
    -H "Content-Type: application/json" \
    -d '{
      "charge_id": "test_charge_123",
      "order_id": "qun1769769950181",
      "amount": 15.80,
      "state": "paid"
    }'
  echo ""
  echo ""
fi

echo "== 测试完成 =="
echo ""
echo "提示："
echo "  - 可以通过环境变量 BASE_URL 指定服务器地址"
echo "    v1 服务器: BASE_URL=http://localhost:9002 ./test-yungou-hook.sh"
echo "    Nuxt 4 服务器: BASE_URL=http://localhost:3000 ./test-yungou-hook.sh"
echo ""
echo "  - Yungouos 回调参数说明（v1 服务器）："
echo "    - code: 支付状态（1=成功）"
echo "    - mchId: 商户ID"
echo "    - orderNo: 云购订单号"
echo "    - outTradeNo: 商户订单号（必填）"
echo "    - money: 支付金额"
echo "    - payNo: 支付流水号"
echo "    - sign: 签名（需要正确计算）"
echo "    - attach: 附加信息，格式：用户名,随机ID,天数"
echo ""
echo "  - 新版本参数说明（Nuxt 4 服务器）："
echo "    - charge_id: 支付单号（必填）"
echo "    - order_id: 订单号（必填）"
echo "    - amount: 支付金额（必填）"
echo "    - state: 订单状态（可选，默认：paid）"