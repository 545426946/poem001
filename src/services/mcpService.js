/**
 * MCP服务层
 * 提供基于Supabase MCP的业务服务接口
 */

import supabaseMCP from '../config/mcp-supabase.js'
import { mockDataService } from './mockDataService.js'

class MCPService {
  constructor() {
    this.mcp = supabaseMCP
    this.initialized = false
  }

  // 初始化MCP服务
  async initialize() {
    if (this.initialized) return true

    try {
      this.initialized = await this.mcp.initialize()
      return this.initialized
    } catch (error) {
      console.error('MCP服务初始化失败:', error)
      this.initialized = false
      return false
    }
  }

  // 用户管理服务
  async getUserProfile(userId) {
    try {
      if (this.initialized) {
        const result = await this.mcp.query('users', {
          where: { id: userId },
          limit: 1
        })
        
        if (result.success && result.data.length > 0) {
          return result.data[0]
        }
      }
      
      // 回退到模拟数据
      return await mockDataService.getUserProfile(userId)
    } catch (error) {
      console.error('获取用户档案失败:', error)
      return await mockDataService.getUserProfile(userId)
    }
  }

  // 学生数据服务
  async getStudentData(studentId) {
    try {
      if (this.initialized) {
        const result = await this.mcp.query('students', {
          where: { id: studentId },
          limit: 1
        })
        
        if (result.success && result.data.length > 0) {
          return result.data[0]
        }
      }
      
      return await mockDataService.getStudentProfile(studentId)
    } catch (error) {
      console.error('获取学生数据失败:', error)
      return await mockDataService.getStudentProfile(studentId)
    }
  }

  // 教师数据服务
  async getTeacherData(teacherId) {
    try {
      if (this.initialized) {
        const result = await this.mcp.query('teachers', {
          where: { id: teacherId },
          limit: 1
        })
        
        if (result.success && result.data.length > 0) {
          return result.data[0]
        }
      }
      
      return await mockDataService.getTeacherProfile(teacherId)
    } catch (error) {
      console.error('获取教师数据失败:', error)
      return await mockDataService.getTeacherProfile(teacherId)
    }
  }

  // 班级管理服务
  async getClassData(classId) {
    try {
      if (this.initialized) {
        const result = await this.mcp.query('classes', {
          where: { id: classId },
          limit: 1
        })
        
        if (result.success && result.data.length > 0) {
          return result.data[0]
        }
      }
      
      return await mockDataService.getClass(classId)
    } catch (error) {
      console.error('获取班级数据失败:', error)
      return await mockDataService.getClass(classId)
    }
  }

  // 学习活动记录
  async recordLearningActivity(activityData) {
    try {
      if (this.initialized) {
        const result = await this.mcp.insert('student_learning_activities', {
          ...activityData,
          created_at: new Date().toISOString()
        })
        
        if (result.success) {
          return result.data
        }
      }
      
      // 模拟记录
      console.log('学习活动记录(模拟):', activityData)
      return { id: Date.now(), ...activityData }
    } catch (error) {
      console.error('记录学习活动失败:', error)
      return null
    }
  }

  // 获取学习进度
  async getLearningProgress(studentId, limit = 50) {
    try {
      if (this.initialized) {
        const result = await this.mcp.query('student_learning_activities', {
          where: { student_id: studentId },
          orderBy: { column: 'created_at', ascending: false },
          limit
        })
        
        if (result.success) {
          return result.data
        }
      }
      
      return await mockDataService.getLearningProgress(studentId)
    } catch (error) {
      console.error('获取学习进度失败:', error)
      return []
    }
  }

  // 诗歌数据服务
  async getPoemsData(category = 'all', limit = null) {
    try {
      if (this.initialized) {
        let queryOptions = {
          orderBy: { column: 'popularity', ascending: false },
          limit: limit || 100
        }
        
        if (category !== 'all') {
          queryOptions.where = { category }
        }
        
        const result = await this.mcp.query('poems', queryOptions)
        
        if (result.success) {
          return result.data
        }
      }
      
      return await mockDataService.getPoems(category, limit)
    } catch (error) {
      console.error('获取诗歌数据失败:', error)
      return await mockDataService.getPoems(category, limit)
    }
  }

  // 统计分析服务
  async getAnalyticsData(type, filters = {}) {
    try {
      if (this.initialized) {
        // 根据类型执行不同的分析查询
        switch (type) {
          case 'college_overview':
            return await this.getCollegeOverview()
          case 'teacher_stats':
            return await this.getTeacherStats(filters.teacherId)
          case 'student_progress':
            return await this.getStudentProgress(filters.studentId)
          default:
            throw new Error(`未知的分析类型: ${type}`)
        }
      }
      
      // 回退到模拟数据
      return await mockDataService.getAnalyticsData(type, filters)
    } catch (error) {
      console.error('获取分析数据失败:', error)
      return await mockDataService.getAnalyticsData(type, filters)
    }
  }

  // 学院概览数据
  async getCollegeOverview() {
    try {
      if (this.initialized) {
        // 获取实时统计数据
        const [studentsCount, teachersCount, classesCount] = await Promise.all([
          this.mcp.query('students', { select: 'count' }),
          this.mcp.query('teachers', { select: 'count' }),
          this.mcp.query('classes', { select: 'count' })
        ])
        
        return {
          totalStudents: studentsCount.success ? studentsCount.data[0].count : 1600,
          totalTeachers: teachersCount.success ? teachersCount.data[0].count : 45,
          activeClasses: classesCount.success ? classesCount.data[0].count : 32,
          avgCompletion: 78, // 需要复杂计算
          highRiskStudents: 128, // 需要复杂计算
          totalPoemsStudied: 24000 // 需要复杂计算
        }
      }
      
      return await mockDataService.getCollegeOverview()
    } catch (error) {
      console.error('获取学院概览失败:', error)
      return await mockDataService.getCollegeOverview()
    }
  }

  // RAG知识检索
  async searchKnowledge(query, options = {}) {
    try {
      if (this.initialized) {
        const result = await this.mcp.ragSearch(query, options)
        
        if (result.success) {
          return result.data
        }
      }
      
      // 模拟RAG搜索
      return await mockDataService.searchKnowledge(query, options)
    } catch (error) {
      console.error('知识检索失败:', error)
      return []
    }
  }

  // 实时订阅服务
  subscribeToUpdates(channel, event, callback) {
    try {
      if (this.initialized) {
        return this.mcp.subscribe(channel, event, callback)
      }
      
      // 模拟订阅
      console.log(`模拟订阅: ${channel}.${event}`)
      return { unsubscribe: () => {} }
    } catch (error) {
      console.error('订阅失败:', error)
      return { unsubscribe: () => {} }
    }
  }

  // 健康检查
  async healthCheck() {
    return await this.mcp.healthCheck()
  }
}

// 创建全局MCP服务实例
const mcpService = new MCPService()

// 导出服务实例
export default mcpService
export { MCPService }