# n8n AI聊天助手工作流配置指南

## 概述
本指南将帮助您在n8n中设置AI聊天助手工作流，用于处理诗词赏析平台的用户对话。

## 步骤1：创建n8n工作流

### 1.1 创建工作流
1. 登录您的n8n实例
2. 点击"New Workflow"创建新工作流
3. 命名为"Poetry AI Chat Assistant"

### 1.2 添加Webhook触发器
1. 添加"Webhook"节点
2. 配置：
   - **HTTP Method**: POST
   - **Path**: `/webhook/poetry-chat`
   - **Response Mode**: Respond to Webhook
   - **Authentication**: 可选设置API密钥

### 1.3 添加AI处理节点
1. 添加"OpenAI"或"AI Agent"节点
2. 配置AI模型参数：
   - **Model**: gpt-3.5-turbo 或 gpt-4
   - **Temperature**: 0.7
   - **Max Tokens**: 1000

### 1.4 系统提示词配置
在AI节点的系统提示词中添加：

```
您是一位专业的诗词AI助手，专门帮助用户：
1. 赏析诗词作品
2. 解释诗词含义
3. 推荐学习路径
4. 解答诗词相关问题

请用中文回答，保持专业、友好的态度。如果用户的问题超出诗词范围，请礼貌地引导回诗词主题。

当前对话历史：{{ $json.conversationHistory }}
用户问题：{{ $json.message }}
```

## 步骤2：工作流完整配置

### 推荐的工作流结构：
```
Webhook (接收请求)
   ↓
数据验证和格式化
   ↓
AI处理节点
   ↓
响应格式化
   ↓
返回结果
```

### 示例工作流JSON配置：
```json
{
  "name": "Poetry AI Chat Assistant",
  "nodes": [
    {
      "parameters": {
        "path": "webhook/poetry-chat",
        "responseMode": "responseNode"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1
    },
    {
      "parameters": {
        "model": "gpt-3.5-turbo",
        "options": {},
        "systemMessage": "您是一位专业的诗词AI助手...",
        "text": "{{ $json.message }}"
      },
      "name": "OpenAI",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1
    },
    {
      "parameters": {
        "options": {}
      },
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1
    }
  ]
}
```

## 步骤3：环境变量配置

在Netlify中设置以下环境变量：

```
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/poetry-chat
```

## 步骤4：测试工作流

### 4.1 测试请求示例
```json
{
  "message": "推荐一首李白的诗",
  "conversationHistory": [],
  "timestamp": "2024-01-01T00:00:00Z",
  "metadata": {
    "source": "poetry-app",
    "version": "1.0.0"
  }
}
```

### 4.2 预期响应
```json
{
  "response": "我推荐李白的《静夜思》：床前明月光，疑是地上霜。举头望明月，低头思故乡。这首诗表达了游子思乡之情，语言简练，意境深远。"
}
```

## 步骤5：部署和监控

### 5.1 激活工作流
1. 在n8n中激活工作流
2. 复制Webhook URL
3. 更新Netlify环境变量

### 5.2 监控和调试
1. 使用n8n的执行历史监控请求
2. 设置错误警报
3. 定期检查响应时间

## 替代方案：使用本地AI服务

如果n8n不可用，系统会自动回退到本地AI服务，提供基本的诗词问答功能。

## 故障排除

### 常见问题：
1. **Webhook 404错误**：检查n8n工作流路径配置
2. **AI响应超时**：调整n8n超时设置
3. **认证失败**：检查API密钥配置

### 调试技巧：
1. 使用n8n的调试模式
2. 检查网络连接
3. 验证环境变量设置

## 安全建议

1. 为n8n Webhook设置认证
2. 限制请求频率
3. 定期更新API密钥
4. 监控异常请求模式

---

**注意**：请根据您的实际n8n实例配置调整上述指南中的URL和参数。