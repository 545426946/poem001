import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './index.css'

// 导入路由配置
import router from './router'

// 导入MCP初始化
import mcpInitializer from './config/mcp-init.js'

// 导入环境变量验证
import { validateEnv } from './utils/env.js'

// 环境变量验证
console.log('环境变量验证:', validateEnv() ? '通过' : '失败')

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
try {
  app.mount('#app')
  console.log('✅ 应用挂载成功')
} catch (error) {
  console.error('❌ 应用挂载失败:', error)
  // 创建错误显示页面
  const errorDiv = document.createElement('div')
  errorDiv.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2>应用启动失败</h2>
      <p>错误信息: ${error.message}</p>
      <p>请检查环境变量配置或联系管理员。</p>
    </div>
  `
  document.getElementById('app').appendChild(errorDiv)
}