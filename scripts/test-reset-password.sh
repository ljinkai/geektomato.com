#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:9002}"
NEW_PASSWORD="${NEW_PASSWORD:-qwe123}"

echo "== 1) 发起忘记密码请求（/qun/forgetUser） =="

curl -sS -X POST "${BASE_URL}/qun/forgetUser" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"l1\"
  }"

echo
echo "== 已发起忘记密码请求，请到邮箱中查收重置链接 =="
echo "== 请从邮件链接中复制 token 并粘贴到下面提示中 =="
echo

read -rp "请输入从重置链接中复制出来的 token: " TOKEN

if [ -z "${TOKEN}" ]; then
  echo "token 不能为空，退出"
  exit 1
fi

echo
echo "== 2) 校验 token 是否有效（/api/qun/verifyResetToken） =="

curl -sS -X GET "${BASE_URL}/api/qun/verifyResetToken" \
  --get \
  --data-urlencode "token=${TOKEN}"

echo
read -rp "如果上一步返回 code=0 表示 token 有效，按回车继续重置密码，Ctrl+C 退出：" _tmp

echo
echo "== 3) 使用 token 重置密码（/api/qun/resetPassword） =="
echo "将要设置的新密码为: ${NEW_PASSWORD}"

curl -sS -X POST "${BASE_URL}/api/qun/resetPassword" \
  -H "Content-Type: application/json" \
  -d "{
    \"token\": \"${TOKEN}\",
    \"newPassword\": \"${NEW_PASSWORD}\"
  }"

echo
echo "== 重置密码请求已发送，若返回 code=0 即表示成功 =="