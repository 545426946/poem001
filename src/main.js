import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './index.css'

// 导入路由配置
import router from './router'

// 导入MCP初始化
import mcpInitializer from './config/mcp-init.js'

// 配置状态管理
const pinia = createPinia()

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(router)
app.use(pinia)

// 初始化MCP系统
mcpInitializer.initialize().then(success => {
  if (success) {
    console.log('✅ MCP系统初始化完成')
  } else {
    console.warn('⚠️ MCP系统初始化失败，使用离线模式')
  }
}).catch(error => {
  console.error('❌ MCP系统初始化错误:', error)
})

// 挂载应用
app.mount('#app')