<template>
  <div id="app">
    <router-view />
    <AIChatAssistant />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AIChatAssistant from '@/components/AIChatAssistant.vue'

const authStore = useAuthStore()

// 应用初始化
onMounted(() => {
  // 初始化认证状态
  authStore.initializeAuth()
})
</script>

<style>
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 全局过渡效果 */
.router-link-active {
  color: var(--primary-600);
}

/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>