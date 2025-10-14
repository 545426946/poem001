import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'

// 导入路由配置
import { routes } from './router'

// 创建应用实例
const app = createApp(App)

// 配置路由
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 配置状态管理
const pinia = createPinia()

// 使用插件
app.use(router)
app.use(pinia)

// 挂载应用
app.mount('#app')