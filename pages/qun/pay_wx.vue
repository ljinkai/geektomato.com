<template>
  <main class="page">
    <section class="card">

      <!-- 未登录状态：显示登录表单 -->
      <div v-if="!isLoggedIn" class="login-section">
        <p class="desc">请先登录后再进行支付</p>
        <form class="form" @submit.prevent="handleLogin">
          <div class="field">
            <label for="loginUsername">用户名或手机号</label>
            <input
              id="loginUsername"
              v-model="loginForm.usernameOrMobile"
              type="text"
              placeholder="请输入用户名或手机号"
              required
            />
          </div>

          <div class="field">
            <label for="loginPassword">密码</label>
            <input
              id="loginPassword"
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              required
            />
          </div>

          <div class="actions">
            <button type="submit" :disabled="loginLoading">
              {{ loginLoading ? '登录中...' : '登录' }}
            </button>
          </div>

          <p v-if="loginError" class="message error">
            {{ loginError }}
          </p>
        </form>
      </div>

      <!-- 已登录状态：显示支付表单 -->
      <div v-else class="pay-section">
        <p class="user-info">
          当前登录用户：<strong>{{ userInfo.userName }}</strong> ({{ userInfo.userId }})
        </p>

        <form class="form" @submit.prevent="generateQrcode">
          <div class="field">
            <label>选择套餐</label>
            <div class="radio-group">
              <label class="radio">
                <input v-model="payForm.day" type="radio" value="31" />
                <span>31 天（1 个月）</span>
              </label>
              <label class="radio">
                <input v-model="payForm.day" type="radio" value="91" />
                <span>91 天（3 个月）</span>
              </label>
              <label class="radio">
                <input v-model="payForm.day" type="radio" value="183" />
                <span>183 天（6 个月）</span>
              </label>
              <label class="radio">
                <input v-model="payForm.day" type="radio" value="365" />
                <span>365 天（12 个月）</span>
              </label>
            </div>
          </div>

          <div class="field">
            <label for="fee">支付金额（元）</label>
            <input
              id="fee"
              v-model.number="payForm.fee"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="请输入支付金额"
              required
            />
          </div>

          <div class="field">
            <label for="name">商品名称</label>
            <input
              id="name"
              v-model="payForm.name"
              type="text"
              placeholder="请输入商品名称"
              required
            />
          </div>

          <div class="actions">
            <button type="submit" :disabled="qrcodeLoading">
              {{ qrcodeLoading ? '生成中...' : '生成支付二维码' }}
            </button>
          </div>

          <p v-if="qrcodeError" class="message error">
            {{ qrcodeError }}
          </p>
        </form>

        <!-- 显示二维码 -->
        <div v-if="qrcodeData" class="qrcode-section">
          <h2>请使用微信扫码支付</h2>
          <div class="qrcode-container">
            <img
              v-if="qrcodeUrl"
              :src="qrcodeUrl"
              alt="支付二维码"
              class="qrcode-image"
              @error="handleQrcodeError"
            />
            <div v-else class="qrcode-placeholder">
              <p>二维码生成中...</p>
              <p class="debug-info" v-if="qrcodeData">
                调试信息：{{ JSON.stringify(qrcodeData, null, 2) }}
              </p>
            </div>
          </div>
          <p v-if="weixinPayUrl" class="pay-url-hint">
            微信支付链接：{{ weixinPayUrl }}
          </p>
          <p v-if="orderNo" class="order-info">
            订单号：{{ orderNo }}
          </p>
          <p class="hint">
            支付完成后，系统会自动更新您的会员时间
          </p>
        </div>

        <!-- 退出登录按钮 -->
        <div class="logout-section">
          <button type="button" class="logout-btn" @click="handleLogout">
            退出登录
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';

const isLoggedIn = ref(false);
const userInfo = reactive<{
  userId: string;
  userName: string;
  token: string;
}>({
  userId: '',
  userName: '',
  token: ''
});

const loginForm = reactive({
  usernameOrMobile: '',
  password: ''
});

const loginLoading = ref(false);
const loginError = ref('');

// 根据天数设置默认费用
const getDefaultFee = (day: string) => {
  const feeMap: Record<string, number> = {
    '31': 15.8,   // 1个月
    '91': 80,   // 3个月
    '183': 150, // 6个月
    '365': 280  // 12个月
  };
  return feeMap[day] || 15.8;
};

const payForm = reactive({
  day: '31',
  fee: 15.8,
  name: '群合影1个月VIP会员'
});

// 监听天数变化，自动更新费用和商品名称
watch(() => payForm.day, (newDay) => {
  payForm.fee = getDefaultFee(newDay);
  const dayMap: Record<string, string> = {
    '31': '群合影1个月VIP会员',
    '91': '群合影3个月VIP会员',
    '183': '群合影6个月VIP会员',
    '365': '群合影12个月VIP会员'
  };
  payForm.name = dayMap[newDay] || '群合影VIP会员';
});

const qrcodeLoading = ref(false);
const qrcodeError = ref('');
const qrcodeData = ref<any>(null);

// 从返回数据中提取微信支付链接
const weixinPayUrl = computed(() => {
  if (!qrcodeData.value) return null;
  // 根据实际返回结构：data.data 中是微信支付链接
  const url = qrcodeData.value.data || 
              qrcodeData.value.code_url || 
              qrcodeData.value.qr_url || 
              qrcodeData.value.qrCode || 
              qrcodeData.value.qrcode ||
              null;
  
  // 如果是微信支付链接格式
  if (url && typeof url === 'string' && url.startsWith('weixin://')) {
    return url;
  }
  return null;
});

// 将微信支付链接转换为二维码图片URL
const qrcodeUrl = computed(() => {
  if (!weixinPayUrl.value) return null;
  // 使用在线二维码生成服务
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(weixinPayUrl.value)}`;
});

const orderNo = computed(() => {
  if (!qrcodeData.value) return null;
  return qrcodeData.value.out_trade_no || 
         qrcodeData.value.outTradeNo ||
         qrcodeData.value.data?.out_trade_no ||
         null;
});

// 检查登录状态
onMounted(() => {
  const stored = localStorage.getItem('qunheying_user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user.userId && user.token) {
        userInfo.userId = user.userId;
        userInfo.userName = user.userName || user.userId;
        userInfo.token = user.token;
        isLoggedIn.value = true;
      }
    } catch (e) {
      console.error('解析用户信息失败:', e);
      localStorage.removeItem('qunheying_user');
    }
  }
});

// 登录处理
async function handleLogin() {
  if (!loginForm.usernameOrMobile || !loginForm.password) {
    loginError.value = '请填写用户名和密码';
    return;
  }

  loginLoading.value = true;
  loginError.value = '';

  try {
    const res = await $fetch<{
      success: boolean;
      data?: {
        userId: string;
        userName: string;
        token: string;
        err_code?: number;
        err_msg?: any;
      };
    }>('/api/qun/userLogin', {
      method: 'POST',
      body: {
        usernameOrMobile: loginForm.usernameOrMobile,
        password: loginForm.password
      }
    });

    if (res && res.success && res.data) {
      userInfo.userId = res.data.userId;
      userInfo.userName = res.data.userName || res.data.userId;
      userInfo.token = res.data.token;
      isLoggedIn.value = true;

      // 保存到 localStorage
      localStorage.setItem(
        'qunheying_user',
        JSON.stringify({
          userId: userInfo.userId,
          userName: userInfo.userName,
          token: userInfo.token
        })
      );

      // 清空登录表单
      loginForm.usernameOrMobile = '';
      loginForm.password = '';
    } else {
      const errMsg =
        res?.data?.err_msg?.rawMessage ||
        res?.data?.err_msg ||
        '登录失败，请检查用户名和密码';
      loginError.value = String(errMsg);
    }
  } catch (e: any) {
    loginError.value = e?.message || '登录失败，请稍后重试';
  } finally {
    loginLoading.value = false;
  }
}

// 生成支付二维码
async function generateQrcode() {
  if (!payForm.day || !payForm.fee || !payForm.name) {
    qrcodeError.value = '请完整填写支付信息';
    return;
  }

  qrcodeLoading.value = true;
  qrcodeError.value = '';
  qrcodeData.value = null;

  try {
    // 生成 attach 参数：用户名,随机ID,天数
    const randomId = generateRandomId();
    const attach = `${userInfo.userId},${randomId},${payForm.day}`;

    const res = await $fetch<{
      code: number;
      msg: string;
      data?: any;
    }>('/qun/wx/qrcode', {
      method: 'POST',
      body: {
        name: payForm.name,
        fee: payForm.fee,
        attach: attach
      }
    });

    // 根据实际返回结构：{ code: 0, msg: "ok", data: { code: 0, data: "weixin://..." } }
    if (res && res.code === 0 && res.data) {
      qrcodeData.value = res.data;
      
      // 检查是否有微信支付链接
      const payUrl = res.data.data || res.data.code_url || res.data.qr_url;
      if (!payUrl) {
        console.warn('返回数据中没有找到支付链接:', res);
        qrcodeError.value = '返回数据格式异常，请查看控制台';
      }
    } else {
      qrcodeError.value = res?.msg || res?.message || '生成二维码失败，请稍后重试';
    }
  } catch (e: any) {
    qrcodeError.value = e?.message || '生成二维码失败，请稍后重试';
  } finally {
    qrcodeLoading.value = false;
  }
}

// 生成随机ID
function generateRandomId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// 处理二维码图片加载错误
function handleQrcodeError() {
  console.error('二维码图片加载失败');
  qrcodeError.value = '二维码图片加载失败，请尝试刷新页面';
}

// 退出登录
function handleLogout() {
  localStorage.removeItem('qunheying_user');
  isLoggedIn.value = false;
  userInfo.userId = '';
  userInfo.userName = '';
  userInfo.token = '';
  qrcodeData.value = null;
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(circle at top, #0f172a, #020617 55%, #000 100%);
}

.card {
  width: 100%;
  max-width: 640px;
  background: rgba(15, 23, 42, 0.98);
  border-radius: 1rem;
  padding: 2rem 2.5rem;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: #e5e7eb;
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 0.75rem;
}

h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.desc {
  font-size: 0.9rem;
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.user-info {
  font-size: 0.9rem;
  color: #9ca3af;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: rgba(56, 189, 248, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-size: 0.9rem;
  color: #e5e7eb;
}

input[type='text'],
input[type='password'],
input[type='number'] {
  padding: 0.55rem 0.7rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  font-size: 0.9rem;
}

input[type='text']:focus,
input[type='password']:focus,
input[type='number']:focus {
  outline: none;
  border-color: #38bdf8;
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.6);
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.radio {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  cursor: pointer;
  font-size: 0.85rem;
}

.radio input {
  accent-color: #38bdf8;
}

.actions {
  margin-top: 0.5rem;
}

.actions button {
  width: 100%;
  padding: 0.6rem 0.9rem;
  border-radius: 0.6rem;
  border: none;
  background: linear-gradient(90deg, #0ea5e9, #22c55e);
  color: #0b1120;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
}

.actions button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  margin-top: 0.5rem;
  font-size: 0.85rem;
}

.message.error {
  color: #f97373;
}

.qrcode-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
}

.qrcode-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  margin: 1rem 0;
}

.qrcode-image {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}

.qrcode-placeholder {
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
}

.debug-info {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
  word-break: break-all;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.order-info {
  text-align: center;
  font-size: 0.85rem;
  color: #9ca3af;
  margin-top: 0.5rem;
}

.hint {
  text-align: center;
  font-size: 0.85rem;
  color: #9ca3af;
  margin-top: 0.5rem;
}

.pay-url-hint {
  text-align: center;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
  word-break: break-all;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
}

.logout-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
}

.logout-btn {
  width: 100%;
  padding: 0.5rem 0.9rem;
  border-radius: 0.6rem;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: transparent;
  color: #e5e7eb;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #f97373;
}
</style>
