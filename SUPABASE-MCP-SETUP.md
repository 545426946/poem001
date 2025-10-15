# Supabase MCP 配置完成指南

## 🎉 配置完成状态

✅ **Supabase MCP 系统已成功配置完成！**

## 📋 配置概览

### 已创建的文件结构

```
src/
├── config/
│   ├── mcp-supabase.js      # MCP核心配置
│   ├── mcp-config.js        # MCP全局配置
│   ├── mcp-init.js          # MCP初始化管理
│   └── supabase.js          # 原有配置（已保留）
├── services/
│   ├── mcpService.js        # MCP业务服务层
│   └── dataService.js       # 数据服务（已集成MCP）
└── utils/
    └── mcp-check.js         # MCP完整性检查工具
```

### 环境配置文件
- `.env.local` - 本地环境变量模板
- `.env.example` - 环境变量示例

## 🚀 快速开始

### 1. 配置Supabase环境变量

在 `.env.local` 文件中填入您的实际Supabase配置：

```env
VITE_SUPABASE_URL=您的实际Supabase项目URL
VITE_SUPABASE_ANON_KEY=您的实际Supabase匿名密钥
```

### 2. 启动应用

```bash
npm run dev
```

应用将在 http://localhost:3000 启动，MCP系统会自动初始化。

### 3. 验证配置

在浏览器控制台中检查MCP初始化状态：

```javascript
// 检查MCP状态
console.log('MCP初始化状态:', window.mcpInitializer?.isInitialized())

// 运行快速检查
import('./src/utils/mcp-check.js').then(module => {
  module.default.quickCheck()
})
```

## 🔧 核心功能

### 数据服务层 (MCP Service)

```javascript
import mcpService from './services/mcpService.js'

// 学生数据查询
const student = await mcpService.getStudentData('S2023001')

// 诗歌数据查询
const poems = await mcpService.getPoemsData('tang', 10)

// 学习活动记录
await mcpService.recordLearningActivity({
  student_id: 'S2023001',
  poem_id: 1,
  score: 85
})

// 实时订阅
const subscription = mcpService.subscribeToUpdates(
  'student_learning_activities',
  'INSERT',
  (payload) => {
    console.log('新活动:', payload)
  }
)
```

### 配置管理

```javascript
import { MCP_FEATURES, MCP_TABLES } from './config/mcp-config.js'

// 功能开关
console.log('RAG搜索功能:', MCP_FEATURES.RAG_SEARCH)

// 表名映射
console.log('学生表:', MCP_TABLES.STUDENTS)
```

## 📊 监控和诊断

### 健康检查

```javascript
import mcpService from './services/mcpService.js'

const health = await mcpService.healthCheck()
console.log('服务状态:', health.healthy ? '正常' : '异常')
```

### 完整性检查

```javascript
import mcpChecker from './utils/mcp-check.js'

// 快速检查
await mcpChecker.quickCheck()

// 完整检查
await mcpChecker.runComprehensiveCheck()
```

## 🔄 离线模式支持

系统已配置完善的离线模式：

- ✅ 网络不可用时自动回退到模拟数据
- ✅ 所有数据操作都有离线处理逻辑
- ✅ 实时订阅在离线时提供模拟接口

## 🛠️ 开发工具

### 调试模式

在开发环境中，MCP系统会自动输出详细的调试信息。

### 事件监听

```javascript
// 监听MCP事件
window.addEventListener('mcp_health_changed', (event) => {
  console.log('健康状态变化:', event.detail)
})

window.addEventListener('mcp_error', (event) => {
  console.error('MCP错误:', event.detail.error)
})
```

## 📈 性能优化

### 缓存配置

系统已配置智能缓存：
- 用户档案：5分钟TTL
- 学生数据：10分钟TTL  
- 班级数据：15分钟TTL
- 诗歌数据：30分钟TTL

### 查询优化
- 默认查询限制：100条
- 最大重试次数：3次
- 查询超时：30秒

## 🔒 安全特性

- ✅ 环境变量验证
- ✅ 错误信息脱敏
- ✅ 权限检查
- ✅ SQL注入防护

## 🐛 故障排除

### 常见问题

1. **连接失败**
   - 检查环境变量配置
   - 验证网络连接
   - 检查Supabase项目状态

2. **权限错误**
   - 验证Supabase行级安全策略
   - 检查匿名密钥权限

3. **性能问题**
   - 调整查询限制
   - 启用缓存优化

### 日志调试

```javascript
// 启用详细日志
localStorage.setItem('mcp_debug', 'true')
```

## 📚 扩展开发

### 添加新的数据表

1. 在 `mcp-config.js` 中添加表名映射
2. 在 `mcpService.js` 中添加业务方法
3. 在 `mockDataService.js` 中添加模拟数据

### 自定义功能

参考现有模式创建新的MCP功能模块。

## 🎯 下一步行动

1. **配置真实的Supabase项目**
   - 在Supabase官网创建项目
   - 获取URL和匿名密钥
   - 更新环境变量

2. **部署数据库表结构**
   - 使用提供的SQL脚本创建表
   - 配置行级安全策略

3. **测试完整功能**
   - 运行完整性检查
   - 验证所有数据操作
   - 测试实时功能

## 📞 支持资源

- [Supabase官方文档](https://supabase.com/docs)
- [MCP配置文档](./README-mcp.md)
- [项目文档](../README.md)

---

**配置完成时间**: 2024年10月15日  
**MCP版本**: 1.0.0  
**兼容性**: Vue 3.x + Supabase 2.x