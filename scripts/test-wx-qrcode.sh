#!/bin/bash

# 测试 /qun/wx/qrcode 接口的 curl 命令

BASE_URL="${BASE_URL:-http://localhost:9002}"

echo "=== 测试：生成微信支付二维码 ==="
echo ""

curl -sS -X POST "${BASE_URL}/qun/wx/qrcode" \
  -H "Content-Type: application/json" \
  -d '{
    "attach": "l1,8e048fcc-98b8-42de-90f7-549fc6e5dc17,365",
    "name": "群合影1年VIP会员",
    "fee": 60
  }'

echo ""
echo ""
echo "== 测试完成 =="
echo ""
echo "提示："
echo "  - 可以通过环境变量 BASE_URL 指定服务器地址，例如：BASE_URL=http://localhost:9002 ./test-wx-qrcode.sh"
echo "  - 参数说明："
echo "    - name: 商品名称（可选，默认：群合影会员）"
echo "    - fee: 支付金额（必填）"
echo "    - attach: 附加信息，格式：用户名,随机ID,天数（必填）"
