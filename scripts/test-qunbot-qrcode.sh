#!/bin/bash

# 测试 /qunBot/qrcode 接口的 curl 命令

BASE_URL="${BASE_URL:-http://localhost:9002}"

echo "=== 测试 1: 获取二维码（不带 userName 参数）==="
curl -sS -X GET "${BASE_URL}/qunBot/qrcode"
echo ""
echo ""

echo "=== 测试 2: 获取二维码（带 userName 参数）==="
USER_NAME="${USER_NAME:-testuser}"
curl -sS -X GET "${BASE_URL}/qunBot/qrcode?userName=${USER_NAME}"
echo ""
echo ""

echo "== 测试完成 =="
echo ""
echo "提示："
echo "  - 可以通过环境变量 BASE_URL 指定服务器地址，例如：BASE_URL=http://localhost:9002 ./test-qunbot-qrcode.sh"
echo "  - 可以通过环境变量 USER_NAME 指定用户名，例如：USER_NAME=l1 ./test-qunbot-qrcode.sh"
