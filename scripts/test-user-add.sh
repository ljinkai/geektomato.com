#!/bin/bash

# 测试 /qun/userAdd 接口的 curl 命令

BASE_URL="http://localhost:9002/api/qun"

echo "=== 测试 1: 使用旧参数格式注册新用户（userId/userName/password/checkPass/email） ==="
TS=$(date +%s)
USER_ID="test${TS}"
EMAIL="${USER_ID}@example.com"

echo "准备注册 userId: $USER_ID, email: $EMAIL"
curl -s -X POST "$BASE_URL/userAdd" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"${USER_ID}\",
    \"userName\": \"${USER_ID}\",
    \"password\": \"${USER_ID}\",
    \"checkPass\": \"${USER_ID}\",
    \"email\": \"${EMAIL}\"
  }"
echo ""
echo ""

echo "=== 测试 2: 再次使用相同 email 注册（应返回 203 邮箱被占用） ==="
curl -s -X POST "$BASE_URL/userAdd" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"${USER_ID}_dup\",
    \"userName\": \"${USER_ID}_dup\",
    \"password\": \"${USER_ID}\",
    \"checkPass\": \"${USER_ID}\",
    \"email\": \"${EMAIL}\"
  }"
echo ""
echo ""

echo "=== 测试 3: 新参数格式（username/password/nickName）注册 ==="
curl -s -X POST "$BASE_URL/userAdd" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"user_${TS}\",
    \"password\": \"userpass123\",
    \"nickName\": \"用户_${TS}\"
  }"
echo ""
echo ""

echo "=== 测试 4: 缺少必填字段（应返回错误）==="
curl -s -X POST "$BASE_URL/userAdd" \
  -H "Content-Type: application/json" \
  -d '{
    \"username\": \"no_password_user\"
  }'
echo ""
echo ""

echo "=== 测试完成 ==="

