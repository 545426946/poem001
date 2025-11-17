/**
 * MCP初始化模块
 * 统一管理MCP服务的初始化和配置
 */

import mcpService from '../services/mcpService.js'
import { MCP_FEATURES, MCP_EVENTS } from './mcp-config.js'

class MCPInitializer {
  constructor() {
    this.initialized = false
    this.initializationPromise = null
  }

  // 初始化MCP系统
  async initialize() {
    if (this.initialized) {
      return true
    }

    if (this.initializationPromise) {
      return await this.initializationPromise
    }

    this.initializationPromise = this._doInitialize()
    return await this.initializationPromise
  }

  async _doInitialize() {
    try {
      console.log('🚀 开始初始化MCP系统...')
      
      // 检查环境配置
      if (!this._validateEnvironment()) {
        console.warn('⚠️ MCP环境配置不完整，将使用离线模式')
        this.initialized = true
        return true
      }

      // 初始化MCP服务
      const mcpInitialized = await mcpService.initialize()
      
      if (mcpInitialized) {
        console.log('✅ MCP服务初始化成功')
        this._setupEventListeners()
        this._startHealthMonitoring()
      } else {
        console.warn('⚠️ MCP服务初始化失败，将使用离线模式')
      }

      this.initialized = true
      this._emitEvent(MCP_EVENTS.CONNECTED, { success: mcpInitialized })
      
      return mcpInitialized
    } catch (error) {
      console.error('❌ MCP系统初始化失败:', error)
      this.initialized = true
      this._emitEvent(MCP_EVENTS.ERROR_OCCURRED, { error: error.message })
      return false
    }
  }

  // 验证环境配置
  _validateEnvironment() {
    const requiredEnvVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ]

    const missingVars = requiredEnvVars.filter(varName => 
      !import.meta.env[varName] || import.meta.env[varName].includes('your_')
    )

    if (missingVars.length > 0) {
      console.warn('缺少必要的环境变量:', missingVars)
      return false
    }

    return true
  }

  // 设置事件监听器
  _setupEventListeners() {
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this._onPageVisible()
      }
    })

    // 监听网络状态变化
    window.addEventListener('online', () => {
      this._onNetworkRestored()
    })

    window.addEventListener('offline', () => {
      this._onNetworkLost()
    })
  }

  // 页面可见时重新检查连接
  _onPageVisible() {
    if (this.initialized) {
      this._checkConnectionHealth()
    }
  }

  // 网络恢复
  _onNetworkRestored() {
    console.log('🌐 网络连接恢复，重新检查MCP连接...')
    this._checkConnectionHealth()
  }

  // 网络断开
  _onNetworkLost() {
    console.warn('🌐 网络连接断开，MCP服务可能受影响')
    this._emitEvent(MCP_EVENTS.HEALTH_CHANGED, { healthy: false, reason: 'network_lost' })
  }

  // 启动健康监控
  _startHealthMonitoring() {
    if (!MCP_FEATURES.HEALTH_MONITORING) return

    setInterval(() => {
      this._checkConnectionHealth()
    }, 30000) // 每30秒检查一次
  }

  // 检查连接健康状态
  async _checkConnectionHealth() {
    try {
      const health = await mcpService.healthCheck()
      this._emitEvent(MCP_EVENTS.HEALTH_CHANGED, health)
      
      if (!health.healthy && this.initialized) {
        console.warn('⚠️ MCP连接健康检查失败:', health.message)
        // 可以在这里实现重连逻辑
      }
    } catch (error) {
      console.error('❌ MCP健康检查失败:', error)
      this._emitEvent(MCP_EVENTS.HEALTH_CHANGED, { 
        healthy: false, 
        message: error.message 
      })
    }
  }

  // 发射事件
  _emitEvent(eventType, data) {
    const event = new CustomEvent(eventType, { detail: data })
    window.dispatchEvent(event)
  }

  // 获取初始化状态
  isInitialized() {
    return this.initialized
  }

  // 获取MCP服务实例
  getService() {
    return mcpService
  }

  // 获取功能状态
  getFeatureStatus(feature) {
    return MCP_FEATURES[feature] || false
  }

  // 手动重连
  async reconnect() {
    if (this.initializationPromise) {
      await this.initializationPromise
    }
    
    this.initialized = false
    this.initializationPromise = null
    
    return await this.initialize()
  }

  // 清理资源
  destroy() {
    if (mcpService && mcpService.mcp) {
      mcpService.mcp.disconnect()
    }
    
    this.initialized = false
    this.initializationPromise = null
    
    console.log('🧹 MCP系统资源已清理')
  }
}

// 创建全局MCP初始化器实例
const mcpInitializer = new MCPInitializer()

// 自动初始化（在应用启动时）
if (typeof window !== 'undefined') {
  // 延迟初始化，避免阻塞主线程
  setTimeout(() => {
    mcpInitializer.initialize().catch(console.error)
  }, 1000)
}

export default mcpInitializer
export { MCPInitializer }