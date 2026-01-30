<template>
  <main class="page">
    <section class="card">
      <h1>重置密码</h1>

      <p v-if="state === 'loading'">正在验证重置链接，请稍候...</p>
      <p v-else-if="state === 'invalid'" class="error">
        重置链接已失效或不存在，请重新发起找回密码。
      </p>

      <form v-else @submit.prevent="onSubmit">
        <p v-if="email" class="hint">
          正在为账号 <strong>{{ email }}</strong> 重置密码
        </p>

        <label class="field">
          <span>新密码</span>
          <input
            v-model="password"
            type="password"
            autocomplete="new-password"
            required
            minlength="6"
          />
        </label>

        <label class="field">
          <span>确认新密码</span>
          <input
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            minlength="6"
          />
        </label>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>

        <button type="submit" :disabled="submitting">
          {{ submitting ? '提交中...' : '确认重置' }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const token = computed(() => String(route.query.token || ''));

const state = ref<'loading' | 'ready' | 'invalid'>('loading');
const email = ref<string | null>(null);
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const success = ref('');
const submitting = ref(false);

onMounted(async () => {
  if (!token.value) {
    state.value = 'invalid';
    return;
  }

  try {
    const res = await $fetch('/api/qun/verifyResetToken', {
      method: 'GET',
      query: { token: token.value }
    });

    if (res && (res as any).code === 0) {
      const data = (res as any).data || {};
      email.value = data.email ?? null;
      state.value = 'ready';
    } else {
      state.value = 'invalid';
    }
  } catch (e) {
    state.value = 'invalid';
  }
});

const onSubmit = async () => {
  error.value = '';
  success.value = '';

  if (password.value.length < 6) {
    error.value = '新密码长度不能少于 6 位';
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致';
    return;
  }

  submitting.value = true;
  try {
    const res = await $fetch('/api/qun/resetPassword', {
      method: 'POST',
      body: {
        token: token.value,
        newPassword: password.value
      }
    });

    if (res && (res as any).code === 0) {
      success.value = '密码重置成功，请使用新密码登录。';
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } else {
      error.value = ((res as any).msg as string) || '重置失败，请稍后重试';
    }
  } catch (e) {
    error.value = '网络异常，请稍后重试';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.card {
  max-width: 480px;
  width: 100%;
  background: #020617;
  border-radius: 1rem;
  padding: 2rem 2.5rem;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

input {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
}

button {
  margin-top: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border: none;
  background: #22c55e;
  color: #020617;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: default;
}

.error {
  color: #f97373;
  font-size: 0.9rem;
}

.success {
  color: #4ade80;
  font-size: 0.9rem;
}

.hint {
  font-size: 0.9rem;
  color: #9ca3af;
}
</style>

