# Supabase MCP 配置文档

## 概述

本项目已成功配置了基于 Supabase 的 MCP (Model Context Protocol) 系统，提供了标准化的数据访问层和实时通信能力。

## 配置结构

### 核心文件

```
src/config/
├── mcp-supabase.js      # MCP核心配置类
├── mcp-config.js        # MCP全局配置常量
├── mcp-init.js          # MCP初始化管理器
└── supabase.js          # 原有Supabase配置

src/services/
├── mcpService.js        # MCP业务服务层
└── dataService.js       # 更新后的数据服务（集成MCP）
```

## 功能特性

### 1. 标准化数据操作
- **统一查询接口**: 提供标准的 CRUD 操作
- **错误处理**: 统一的错误处理机制
- **离线支持**: 网络不可用时自动回退到模拟数据

### 2. 实时通信
- **实时订阅**: 支持数据库变更的实时监听
- **事件驱动**: 基于自定义事件的通信机制
- **连接管理**: 自动重连和健康检查

### 3. 性能优化
- **缓存机制**: 智能数据缓存减少网络请求
- **批量操作**: 支持批量数据操作
- **连接池**: 优化的连接管理

### 4. 监控诊断
- **健康检查**: 定期检查连接状态
- **性能监控**: 查询性能指标收集
- **错误追踪**: 详细的错误日志和诊断信息

## 使用方法

### 基本初始化

```javascript
// 在应用入口文件中初始化
import mcpInitializer from './config/mcp-init.js'

// 自动初始化（推荐）
// 或手动初始化
await mcpInitializer.initialize()
```

### 数据操作示例

```javascript
import mcpService from './services/mcpService.js'

// 查询数据
const students = await mcpService.getStudentData('student123')

// 插入数据
const result = await mcpService.recordLearningActivity({
  student_id: 'student123',
  poem_id: 'poem456',
  score: 85
})

// 实时订阅
const subscription = mcpService.subscribeToUpdates(
  'student_learning_activities',
  'INSERT',
  (payload) => {
    console.log('新学习活动:', payload)
  }
)
```

### 配置环境变量

在 `.env.local` 文件中配置：

```env
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

## 配置选项

### 功能开关

在 `src/config/mcp-config.js` 中可配置：

```javascript
export const MCP_FEATURES = {
  DATA_SERVICE: true,           // 数据服务
  REAL_TIME_UPDATES: true,      // 实时更新
  RAG_SEARCH: true,             // RAG搜索
  CACHING: true,                // 缓存
  HEALTH_MONITORING: true       // 健康监控
}
```

### 性能配置

```javascript
export const MCP_QUERY_CONFIG = {
  DEFAULT_LIMIT: 100,          // 默认查询限制
  MAX_RETRIES: 3,              // 最大重试次数
  QUERY_TIMEOUT: 30000         // 查询超时(ms)
}
```

## 错误处理

MCP 系统提供统一的错误处理：

```javascript
try {
  const result = await mcpService.query('users', { where: { id: '123' } })
  if (!result.success) {
    console.error('查询失败:', result.error)
  }
} catch (error) {
  console.error('系统错误:', error)
}
```

## 监控和诊断

### 健康检查

```javascript
const health = await mcpService.healthCheck()
console.log('服务状态:', health.healthy ? '正常' : '异常')
```

### 事件监听

```javascript
window.addEventListener('mcp_health_changed', (event) => {
  console.log('健康状态变化:', event.detail)
})

window.addEventListener('mcp_error', (event) => {
  console.error('MCP错误:', event.detail.error)
})
```

## 最佳实践

1. **尽早初始化**: 在应用启动时初始化 MCP 系统
2. **错误处理**: 对所有 MCP 操作进行错误处理
3. **资源清理**: 在组件卸载时取消订阅
4. **性能监控**: 定期检查系统性能指标
5. **离线支持**: 确保应用在离线状态下仍能正常工作

## 故障排除

### 常见问题

1. **连接失败**: 检查环境变量配置和网络连接
2. **权限错误**: 验证 Supabase 行级安全策略
3. **性能问题**: 调整查询限制和缓存配置

### 日志调试

启用详细日志：

```javascript
// 在开发环境中
localStorage.setItem('mcp_debug', 'true')
```

## 扩展开发

如需扩展 MCP 功能，可参考现有模式：

1. 在 `mcpService.js` 中添加新的业务方法
2. 在 `mcp-config.js` 中定义相关配置
3. 更新 `mcp-init.js` 中的初始化逻辑

## 版本信息

- **MCP版本**: 1.0.0
- **Supabase JS**: ^2.33.1
- **兼容性**: Vue 3.x, 支持现代浏览器

---

*此文档最后更新: 2024年10月15日*