<template>
  <main class="page">
    <section class="card">
      <h1>qunheying.com - 更新过期时间</h1>

      <p class="desc">
        管理后台工具：根据用户名、密码和天数，更新对应用户的会员过期时间。
      </p>

      <form class="form" @submit.prevent="submit">
        <div class="field">
          <label for="userName">用户名</label>
          <input
            id="userName"
            v-model="form.userName"
            type="text"
            placeholder="请输入用户名"
            required
          />
        </div>

        <div class="field">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            required
          />
        </div>

        <div class="field">
          <label>天数</label>
          <div class="radio-group">
            <label class="radio">
              <input v-model="form.day" type="radio" value="31" />
              <span>31 天（1 个月）</span>
            </label>
            <label class="radio">
              <input v-model="form.day" type="radio" value="91" />
              <span>91 天（3 个月）</span>
            </label>
            <label class="radio">
              <input v-model="form.day" type="radio" value="183" />
              <span>183 天（6 个月）</span>
            </label>
            <label class="radio">
              <input v-model="form.day" type="radio" value="365" />
              <span>365 天（12 个月）</span>
            </label>
            <label class="radio">
              <input v-model="form.day" type="radio" value="30" />
              <span>30 天（1 个月高级）</span>
            </label>
          </div>
        </div>

        <div class="field checkbox">
          <label>
            <input v-model="form.overlay" type="checkbox" />
            <span>从当前过期时间叠加（勾选则在原过期时间基础上增加天数）</span>
          </label>
        </div>

        <div class="actions">
          <button type="submit" :disabled="loading">
            {{ loading ? '更新中...' : '更新' }}
          </button>
        </div>

        <p v-if="message" :class="['message', messageType]">
          {{ message }}
        </p>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
const form = reactive({
  userName: '',
  password: '',
  day: '31',
  overlay: true
});

const loading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

async function submit() {
  if (!form.userName || !form.password || !form.day) {
    message.value = '请完整填写用户名、密码和天数';
    messageType.value = 'error';
    return;
  }

  loading.value = true;
  message.value = '';

  try {
    const res = await $fetch<{
      success?: boolean;
      data?: {
        expirationAt?: string;
        err_code?: number;
        err_msg?: unknown;
      };
    }>('/qun/updateExp', {
      method: 'POST',
      body: {
        userName: form.userName,
        password: form.password,
        day: form.day,
        overlay: form.overlay
      }
    });

    if (res && res.success) {
      const exp = res.data?.expirationAt;
      if (exp) {
        message.value = `更新成功，新的过期时间：${exp}`;
      } else {
        message.value = '更新成功';
      }
      messageType.value = 'success';
    } else {
      const errMsg =
        (res?.data as any)?.err_msg?.rawMessage ||
        (res?.data as any)?.err_msg ||
        '更新失败';
      message.value = String(errMsg);
      messageType.value = 'error';
    }
  } catch (e: any) {
    message.value = e?.message || '请求失败，请稍后重试';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
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

.desc {
  font-size: 0.9rem;
  color: #9ca3af;
  margin-bottom: 1.5rem;
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
input[type='password'] {
  padding: 0.55rem 0.7rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  font-size: 0.9rem;
}

input[type='text']:focus,
input[type='password']:focus {
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

.checkbox {
  font-size: 0.85rem;
  color: #cbd5f5;
}

.checkbox label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.checkbox input {
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

.message.success {
  color: #4ade80;
}

.message.error {
  color: #f97373;
}
</style>

