#!/bin/bash

# 测试 /qun/synchronizationUser 接口的 curl 命令

BASE_URL="http://localhost:3000/api/qun"

echo "=== 测试 1: 同步已存在用户（LeanCloud 用户 l1，带密码）==="
curl -s -X POST "$BASE_URL/synchronizationUser" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "l1",
    "password": "qwe123"
  }'
echo ""
echo ""

echo "=== 测试 2: 同步（如果不存在就创建）新用户 ==="
NOW_TS=$(date +%s)
NEW_USER="syncuser${NOW_TS}"

echo "准备创建用户: $NEW_USER"
curl -s -X POST "$BASE_URL/synchronizationUser" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"${NEW_USER}\",
    \"password\": \"syncpass123\",
    \"nickName\": \"同步用户_${NOW_TS}\"
  }"
echo ""
echo ""

echo "=== 测试 3: 仅传唯一标识（应报错：缺少 password/nickName）==="
curl -s -X POST "$BASE_URL/synchronizationUser" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "only-identifier"
  }'
echo ""
echo ""

echo "=== 测试 4: 使用手机号码作为唯一标识同步 ==="
curl -s -X POST "$BASE_URL/synchronizationUser" \
  -H "Content-Type: application/json" \
  -d '{
    "mobilePhoneNumber": "13800000000",
    "password": "mobilepass123",
    "nickName": "手机号同步用户"
  }'
echo ""

