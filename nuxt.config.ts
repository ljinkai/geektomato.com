// 基于 Nuxt 3/4 的最小配置，使用根目录作为应用根目录
export default defineNuxtConfig({
  srcDir: ".",
  compatibilityDate: "2026-01-28",
  nitro: {
    preset: "node-server",
  },
  typescript: {
    strict: false
  },
  modules: [],
  devtools: {
    enabled: true
  }
});


