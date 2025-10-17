// n8n服务集成
import { ref, computed } from 'vue'

class N8nService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook'
    this.connectionStatus = ref('disconnected')
    this.retryCount = 0
    this.maxRetries = 3
  }

  // 检查连接状态
  async checkConnection() {
    try {
      this.connectionStatus.value = 'connecting'
      
      const response = await fetch(this.baseUrl, {
        method: 'HEAD',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        this.connectionStatus.value = 'connected'
        this.retryCount = 0
        return true
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('n8n连接检查失败:', error)
      this.connectionStatus.value = 'error'
      
      // 自动重试
      if (this.retryCount < this.maxRetries) {
        this.retryCount++
        setTimeout(() => this.checkConnection(), 2000)
      }
      
      return false
    }
  }

  // 发送消息到n8n
  async sendMessage(message, conversationHistory = []) {
    try {
      this.connectionStatus.value = 'connecting'
      
      const payload = {
        message: message,
        conversationHistory: conversationHistory.slice(-10), // 只发送最近10条消息
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'poetry-app',
          version: import.meta.env.VITE_APP_VERSION || '1.0.0'
        }
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      this.connectionStatus.value = 'connected'
      this.retryCount = 0
      
      return data.response || '抱歉，我暂时无法回答这个问题。'

    } catch (error) {
      console.error('发送消息到n8n失败:', error)
      this.connectionStatus.value = 'error'
      
      // 如果n8n不可用，使用本地AI服务作为回退
      return await this.fallbackToLocalAI(message, conversationHistory)
    }
  }

  // 本地AI服务回退
  async fallbackToLocalAI(message, conversationHistory) {
    try {
      // 简单的关键词匹配回复
      const lowerMessage = message.toLowerCase()
      
      if (lowerMessage.includes('推荐') || lowerMessage.includes('经典') || lowerMessage.includes('诗词')) {
        return this.generatePoemRecommendation()
      } else if (lowerMessage.includes('赏析') || lowerMessage.includes('分析')) {
        return this.generatePoemAnalysis()
      } else if (lowerMessage.includes('含义') || lowerMessage.includes('意思')) {
        return this.generateMeaningExplanation()
      } else if (lowerMessage.includes('学习') || lowerMessage.includes('路径')) {
        return this.generateLearningPath()
      } else {
        return '您好！我是诗词AI助手。由于系统维护，我暂时使用简化模式。您可以问我关于诗词推荐、赏析、含义解释等问题。'
      }
    } catch (error) {
      console.error('本地AI回退失败:', error)
      return '抱歉，我暂时无法处理您的请求。请稍后再试或联系管理员。'
    }
  }

  // 生成诗词推荐
  generatePoemRecommendation() {
    const poems = [
      {
        title: '静夜思',
        author: '李白',
        dynasty: '唐代',
        content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
        reason: '这首五言绝句语言简练，意境深远，表达了游子思乡之情，是李白最著名的作品之一。'
      },
      {
        title: '春晓',
        author: '孟浩然',
        dynasty: '唐代', 
        content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
        reason: '描绘春日早晨的生动画面，语言清新自然，充满生活情趣。'
      },
      {
        title: '登鹳雀楼',
        author: '王之涣',
        dynasty: '唐代',
        content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
        reason: '气势磅礴，寓含人生哲理，鼓励人们不断进取。'
      }
    ]
    
    const poem = poems[Math.floor(Math.random() * poems.length)]
    return `我推荐《${poem.title}》- ${poem.author}（${poem.dynasty}）\n\n${poem.content}\n\n推荐理由：${poem.reason}`
  }

  // 生成诗词分析
  generatePoemAnalysis() {
    return `诗词赏析通常包括以下几个方面：

1. **背景分析**：了解创作时代背景和诗人经历
2. **内容理解**：逐句解读诗词含义
3. **艺术特色**：分析修辞手法、语言特点
4. **情感表达**：体会诗人想要表达的情感
5. **文化内涵**：挖掘诗词背后的文化意义

请提供具体的诗词名称，我可以为您进行详细赏析。`
  }

  // 生成含义解释
  generateMeaningExplanation() {
    return `诗词含义解释可以从以下几个角度进行：

• **字面意思**：逐字逐句的直译理解
• **深层含义**：挖掘诗词的象征意义和隐喻
• **文化背景**：结合历史背景理解特定表达
• **情感色彩**：体会诗词表达的情感态度

您可以告诉我具体的诗词句子，我来帮您解释其含义。`
  }

  // 生成学习路径
  generateLearningPath() {
    return `建议的诗词学习路径：

**初级阶段（1-3个月）**
• 学习经典唐诗宋词50首
• 掌握基本格律和修辞手法
• 了解主要诗人和流派

**中级阶段（3-6个月）**  
• 深入赏析100首经典作品
• 学习诗词创作背景和历史
• 尝试简单的诗词创作

**高级阶段（6个月以上）**
• 研究诗词理论和发展史
• 深入分析艺术特色和风格
• 参与诗词创作和交流活动

您可以根据自己的兴趣和时间安排选择合适的学习节奏。`
  }

  // 获取连接状态
  getConnectionStatus() {
    return this.connectionStatus
  }
}

// 创建单例实例
const n8nService = new N8nService()

// Vue composable
export const useN8nService = () => {
  const connectionStatus = computed(() => n8nService.connectionStatus.value)

  const sendMessageToN8n = async (message, conversationHistory) => {
    return await n8nService.sendMessage(message, conversationHistory)
  }

  const checkConnection = async () => {
    return await n8nService.checkConnection()
  }

  return {
    connectionStatus,
    sendMessageToN8n,
    checkConnection
  }
}

export default n8nService