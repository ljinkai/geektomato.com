#!/bin/bash

# 测试登录接口的 curl 命令

BASE_URL="http://localhost:3000/api/qun"

# echo "=== 测试 1: 使用新注册用户登录（pbkdf2 算法）==="
# echo "用户名: testuser1769661183"
# echo "密码: testpass123"
# echo ""
# curl -X POST "$BASE_URL/userLogin" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "usernameOrMobile": "testuser1769661183",
#     "password": "testpass123"
#   }'
# echo ""
# echo ""

# echo "=== 测试 2: 使用用户名登录（LeanCloud 用户，需要知道原始密码）==="
# echo "注意：LeanCloud 迁移用户的密码使用 SHA-512 加密，需要原始密码才能测试"
# echo "格式示例："
# echo ""
# curl -X POST "$BASE_URL/userLogin" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "usernameOrMobile": "l1",
#     "password": "qwe123"
#   }'
# echo ""
# echo ""


echo "=== 测试 2: 新用户注册 ==="
echo "注意：LeanCloud 迁移用户的密码使用 SHA-512 加密，需要原始密码才能测试"
echo "格式示例："
echo ""
curl -X POST "$BASE_URL/userLogin" \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrMobile": "test012901",
    "password": "test012901"
  }'
echo ""
echo ""

# echo "=== 测试 3: 使用手机号登录（如果用户有手机号）==="
# curl -X POST "$BASE_URL/userLogin" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "usernameOrMobile": "13643777842",
#     "password": "your_password_here"
#   }'
# echo ""
# echo ""

# echo "=== 测试 4: 错误密码（应该返回失败）==="
# curl -X POST "$BASE_URL/userLogin" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "usernameOrMobile": "testuser1769661183",
#     "password": "wrongpassword"
#   }'
# echo ""
# echo ""

# echo "=== 测试 5: 缺少参数（应该返回错误）==="
# curl -X POST "$BASE_URL/userLogin" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "usernameOrMobile": "testuser1769661183"
#   }'
# echo ""
