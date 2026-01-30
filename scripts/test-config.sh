#!/bin/bash

# 测试 /qun/config 接口的 curl 命令

BASE_URL="http://localhost:9002/api/qun"

echo "=== 测试 1: 获取配置（/qun/config）==="
RESPONSE=$(curl -s -X GET "$BASE_URL/config" \
  -H "Content-Type: application/json")

# 尝试使用 jq 格式化输出，如果没有 jq 则使用 python
if command -v jq &> /dev/null; then
  echo "$RESPONSE" | jq .
else
  echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
fi
echo ""
echo ""

echo "=== 测试完成 ==="

