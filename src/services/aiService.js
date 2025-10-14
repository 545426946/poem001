import { searchKnowledgeBase } from '../config/supabase'

// AI服务类
class AIService {
  constructor() {
    this.conversationHistory = new Map()
  }

  // 获取对话历史
  getConversationHistory(userId) {
    return this.conversationHistory.get(userId) || []
  }

  // 添加对话记录
  addToConversationHistory(userId, message, isUser = true) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, [])
    }
    
    const history = this.conversationHistory.get(userId)
    history.push({
      role: isUser ? 'user' : 'assistant',
      content: message,
      timestamp: new Date().toISOString()
    })
    
    // 保持最近20条对话记录
    if (history.length > 20) {
      history.splice(0, history.length - 20)
    }
  }

  // 诗歌分析AI
  async analyzePoem(poem, question, userId) {
    try {
      // 首先从知识库中搜索相关信息
      const knowledgeResults = await searchKnowledgeBase(question)
      
      // 构建上下文
      const context = {
        poem: {
          title: poem.title,
          author: poem.author,
          content: poem.content,
          dynasty: poem.dynasty
        },
        knowledge: knowledgeResults,
        conversationHistory: this.getConversationHistory(userId)
      }

      // 根据问题类型生成不同的回答
      let response = ''
      
      if (question.includes('意思') || question.includes('含义')) {
        response = this.generateMeaningAnalysis(context)
      } else if (question.includes('背景') || question.includes('创作')) {
        response = this.generateBackgroundAnalysis(context)
      } else if (question.includes('特色') || question.includes('艺术')) {
        response = this.generateArtisticAnalysis(context)
      } else {
        response = this.generateGeneralAnalysis(context)
      }

      // 添加到对话历史
      this.addToConversationHistory(userId, question, true)
      this.addToConversationHistory(userId, response, false)

      return response
    } catch (error) {
      console.error('AI分析失败:', error)
      return '抱歉，我暂时无法分析这首诗。请稍后再试或联系管理员。'
    }
  }

  // 生成含义分析
  generateMeaningAnalysis(context) {
    const { poem, knowledge } = context
    return `${poem.title}是${poem.author}在${poem.dynasty}创作的代表作。这首诗通过${this.extractKeywords(poem.content)}等意象，表达了${this.inferTheme(poem.content)}的主题。${knowledge.length > 0 ? `根据相关资料：${knowledge[0]?.content}` : ''}`
  }

  // 生成背景分析
  generateBackgroundAnalysis(context) {
    const { poem } = context
    return `${poem.title}创作于${poem.dynasty}时期，当时${this.generateHistoricalContext(poem.dynasty)}。${poem.author}在${this.inferCreationBackground(poem.content)}的背景下创作了这首诗。`
  }

  // 生成艺术特色分析
  generateArtisticAnalysis(context) {
    const { poem } = context
    return `${poem.title}展现了${poem.author}独特的艺术风格。诗中运用了${this.identifyLiteraryDevices(poem.content)}等修辞手法，语言${this.assessLanguageStyle(poem.content)}，意境${this.assessImagery(poem.content)}。`
  }

  // 通用分析
  generateGeneralAnalysis(context) {
    const { poem } = context
    return `《${poem.title}》是${poem.dynasty}诗人${poem.author}的经典作品。这首诗${this.generateGeneralDescription(poem.content)}，在文学史上具有重要地位。`
  }

  // 辅助分析函数
  extractKeywords(content) {
    const words = content.replace(/[，。]/g, ' ').split(' ').filter(word => word.length > 1)
    return words.slice(0, 3).join('、')
  }

  inferTheme(content) {
    if (content.includes('思乡') || content.includes('故乡')) return '思乡怀旧'
    if (content.includes('春天') || content.includes('春')) return '赞美自然'
    if (content.includes('登高') || content.includes('望远')) return '人生哲理'
    return '抒情写意'
  }

  generateHistoricalContext(dynasty) {
    const contexts = {
      '唐代': '唐代是中国诗歌的黄金时期，社会经济繁荣，文化开放多元',
      '宋代': '宋代注重文治，词赋创作兴盛，理学思想影响深远',
      '明代': '明代复古思潮盛行，同时市民文学开始兴起',
      '清代': '清代考据学发达，诗歌创作兼具传统与创新'
    }
    return contexts[dynasty] || '该时期文化发展具有独特特色'
  }

  inferCreationBackground(content) {
    if (content.includes('月') || content.includes('夜')) return '月夜思乡'
    if (content.includes('春') || content.includes('花')) return '春日感怀'
    if (content.includes('山') || content.includes('水')) return '山水游览'
    return '日常生活感悟'
  }

  identifyLiteraryDevices(content) {
    const devices = []
    if (content.includes('比喻') || content.match(/如|似/)) devices.push('比喻')
    if (content.includes('对偶') || this.checkParallelism(content)) devices.push('对偶')
    if (content.includes('夸张') || content.match(/千|万/)) devices.push('夸张')
    return devices.length > 0 ? devices.join('、') : '多种修辞手法'
  }

  checkParallelism(content) {
    const lines = content.split('。').filter(line => line)
    return lines.length >= 2 && lines[0].length === lines[1].length
  }

  assessLanguageStyle(content) {
    const length = content.length
    if (length < 20) return '简洁明快'
    if (length < 40) return '优美流畅'
    return '深沉含蓄'
  }

  assessImagery(content) {
    if (content.includes('月') || content.includes('山水')) return '优美深远'
    if (content.includes('花') || content.includes('春')) return '清新自然'
    return '意境独特'
  }

  generateGeneralDescription(content) {
    return `语言精炼，意象生动，情感真挚，${this.inferTheme(content)}的主题表达得淋漓尽致`
  }

  // 学习建议生成
  async generateLearningSuggestion(studentData, currentPoem) {
    const { progress, strengths, weaknesses } = studentData
    
    let suggestion = `根据您的学习情况（掌握度${progress}%），建议：`
    
    if (progress < 50) {
      suggestion += '重点加强诗歌基础知识的理解，多阅读相关背景资料。'
    } else if (progress < 80) {
      suggestion += '可以尝试深入分析诗歌的艺术特色和创作技巧。'
    } else {
      suggestion += '建议挑战更高难度的诗歌赏析，拓展文学视野。'
    }

    if (weaknesses.length > 0) {
      suggestion += `特别需要关注${weaknesses.join('、')}方面的提升。`
    }

    return suggestion
  }
}

export const aiService = new AIService()
export default aiService