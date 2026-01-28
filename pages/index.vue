<template>
  <main class="page">
    <section class="card">
      <h1>geektomato · Nuxt4 API 层</h1>
      <p>当前仓库已初始化为 Nuxt 3/4 应用，可在 <code>server/api</code> 下实现新的 /qun/* 接口。</p>
      <p>运行步骤：</p>
      <ol>
        <li>在项目根目录执行：<code>npm install</code></li>
        <li>开发模式：<code>npm run dev</code></li>
        <li>生产构建：<code>npm run build && npm run start</code></li>
      </ol>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.card {
  max-width: 640px;
  width: 100%;
  background: #020617;
  border-radius: 1rem;
  padding: 2rem 2.5rem;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

p {
  margin: 0.25rem 0;
}

code {
  background: rgba(15, 23, 42, 0.9);
  padding: 0.15rem 0.3rem;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

ol {
  margin: 0.75rem 0 0;
  padding-left: 1.25rem;
}
</style>


