curl 'https://qhy.geektomato.com/qun/userAdd' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,es-ES;q=0.6,es;q=0.5,de-DE;q=0.4,de;q=0.3' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  -H 'Origin: https://www.qunheying.com' \
  -H 'Pragma: no-cache' \
  -H 'Referer: https://www.qunheying.com/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: cross-site' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  --data-raw '{"userId":"test012901","userName":"test012901","password":"test012901","checkPass":"test012901","email":"byteflowtheme+1@gmail.com"}'



body=群合影一个月VIP会员&mch_id=1635138365&out_trade_no=qun1769769109163&total_fee=15.8&key=555996BFBDB54D0397663F42B8511FE0
https://api.pay.yungouos.com/api/pay/wxpay/nativePay {
  out_trade_no: 'qun1769769109163',
  total_fee: 15.8,
  mch_id: 1635138365,
  body: '群合影一个月VIP会员',
  sign: '33882A1A4A7068CE7D0FE101B8683811',
  notify_url: 'http://geektomato.com/qun/yungou/hook',
  attach: 'l1,6549ebb0-2aa2-4cf7-9e62-4ef5283c4836,31'
}
-----yungouos order query-----
query: l1 6549ebb0-2aa2-4cf7-9e62-4ef5283c4836
order: {}
-----yungouos order query-----
query: l1 6549ebb0-2aa2-4cf7-9e62-4ef5283c4836
order: {}
-----Yungouosd hook-----
Yungouos: {
  code: '1',
  mchId: '1635138365',
  orderNo: 'Y18455017807548',
  openId: 'o-_-it_l-Cc2zQxc93z3gKFcvE5A',
  sign: 'E985076D11E251C29F9FB3CFAE5B85F6',
  payBank: '交通银行（信用卡）',
  payNo: '4200002980202601307163506101',
  money: '15.80',
  outTradeNo: 'qun1769769950181',
  payChannel: 'wxpay',
  attach: 'l1,1769769950159-c671xdvl0u9,31',
  time: '2026-01-30 18:46:31'
}
params: {
  code: '1',
  mchId: '1635138365',
  orderNo: 'Y18455017807548',
  openId: 'o-_-it_l-Cc2zQxc93z3gKFcvE5A',
  sign: 'E985076D11E251C29F9FB3CFAE5B85F6',
  payBank: '交通银行（信用卡）',
  payNo: '4200002980202601307163506101',
  money: '15.80',
  outTradeNo: 'qun1769769950181',
  payChannel: 'wxpay',
  attach: 'l1,1769769950159-c671xdvl0u9,31',
  time: '2026-01-30 18:46:31'
}
code=1&mchId=1635138365&money=15.80&orderNo=Y18455017807548&outTradeNo=qun1769769950181&payNo=4200002980202601307163506101&key=555996BFBDB54D0397663F42B8511FE0
order: {}
syncOrder plusinfo: { uid: 'l1', r: '1769769950159-c671xdvl0u9', d: '31' }
onYunHook order: {
  data: {
    order_id: 'qun1769769950181',
    amount: '15.80',
    payway: 'wxpay',
    state: '1',
    user_id: 'l1',
    qr_id: '1769769950159-c671xdvl0u9',
    day: '31'
  }
}
updatePayUserExp: l1 31
first account:
==account=== 1772354988921 1769769993242
-----notificationToWX before-----
-----notificationToWX after-----