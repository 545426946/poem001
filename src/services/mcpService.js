/**
 * MCP服务层 - 诗词赏析平台
 * 提供基于Supabase MCP的业务服务接口
 */

import supabaseMCP from '../config/supabase.js'
import { fallbackPoems, fallbackPoets } from '../data/poems.js'
import { enrichedPoemsData } from '../data/enriched-poems.js'

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

  // 获取诗词数据
  async getPoems(category = 'all', limit = null) {
    try {
      if (this.initialized) {
        let queryOptions = {
          orderBy: { column: 'created_at', ascending: false },
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
      
      // 回退到丰富数据
      let poems = [...fallbackPoems, ...enrichedPoemsData]
      if (category !== 'all') {
        poems = poems.filter(poem => poem.category === category)
      }
      if (limit) {
        poems = poems.slice(0, limit)
      }
      return poems
    } catch (error) {
      console.error('获取诗词数据失败:', error)
      // 回退到丰富数据
      let poems = [...fallbackPoems, ...enrichedPoemsData]
      if (category !== 'all') {
        poems = poems.filter(poem => poem.category === category)
      }
      if (limit) {
        poems = poems.slice(0, limit)
      }
      return poems
    }
  }

  // 获取诗人数据
  async getPoets(dynasty = 'all', limit = null) {
    try {
      if (this.initialized) {
        let queryOptions = {
          orderBy: { column: 'name', ascending: true },
          limit: limit || 100
        }
        
        if (dynasty !== 'all') {
          queryOptions.where = { dynasty }
        }
        
        const result = await this.mcp.query('poets', queryOptions)
        
        if (result.success) {
          return result.data
        }
      }
      
      // 回退到丰富诗人数据
      const enrichedPoets = [
        { id: 1, name: '李白', dynasty: '唐代', style: '浪漫主义', description: '诗仙，唐代伟大的浪漫主义诗人。' },
        { id: 2, name: '杜甫', dynasty: '唐代', style: '现实主义', description: '诗圣，唐代伟大的现实主义诗人。' },
        { id: 3, name: '苏轼', dynasty: '宋代', style: '豪放派', description: '宋代文学巨匠，诗词文书画俱佳。' },
        { id: 4, name: '李清照', dynasty: '宋代', style: '婉约派', description: '宋代著名女词人，婉约词派的代表。' },
        { id: 5, name: '王维', dynasty: '唐代', style: '山水田园', description: '诗佛，唐代山水田园诗派的代表。' },
        { id: 6, name: '白居易', dynasty: '唐代', style: '现实主义', description: '唐代伟大的现实主义诗人，作品通俗易懂。' },
        { id: 7, name: '辛弃疾', dynasty: '宋代', style: '豪放派', description: '南宋爱国词人，豪放词派的代表。' },
        { id: 8, name: '陆游', dynasty: '宋代', style: '爱国诗', description: '南宋爱国诗人，作品充满爱国情怀。' },
        { id: 9, name: '孟浩然', dynasty: '唐代', style: '山水田园', description: '唐代山水田园诗派的代表诗人。' },
        { id: 10, name: '王之涣', dynasty: '唐代', style: '边塞诗', description: '唐代边塞诗派的代表诗人。' }
      ]
      
      let poets = enrichedPoets
      if (dynasty !== 'all') {
        poets = poets.filter(poet => poet.dynasty === dynasty)
      }
      if (limit) {
        poets = poets.slice(0, limit)
      }
      return poets
    } catch (error) {
      console.error('获取诗人数据失败:', error)
      // 回退到丰富诗人数据
      const enrichedPoets = [
        { id: 1, name: '李白', dynasty: '唐代', style: '浪漫主义', description: '诗仙，唐代伟大的浪漫主义诗人。' },
        { id: 2, name: '杜甫', dynasty: '唐代', style: '现实主义', description: '诗圣，唐代伟大的现实主义诗人。' },
        { id: 3, name: '苏轼', dynasty: '宋代', style: '豪放派', description: '宋代文学巨匠，诗词文书画俱佳。' },
        { id: 4, name: '李清照', dynasty: '宋代', style: '婉约派', description: '宋代著名女词人，婉约词派的代表。' },
        { id: 5, name: '王维', dynasty: '唐代', style: '山水田园', description: '诗佛，唐代山水田园诗派的代表。' },
        { id: 6, name: '白居易', dynasty: '唐代', style: '现实主义', description: '唐代伟大的现实主义诗人，作品通俗易懂。' },
        { id: 7, name: '辛弃疾', dynasty: '宋代', style: '豪放派', description: '南宋爱国词人，豪放词派的代表。' },
        { id: 8, name: '陆游', dynasty: '宋代', style: '爱国诗', description: '南宋爱国诗人，作品充满爱国情怀。' },
        { id: 9, name: '孟浩然', dynasty: '唐代', style: '山水田园', description: '唐代山水田园诗派的代表诗人。' },
        { id: 10, name: '王之涣', dynasty: '唐代', style: '边塞诗', description: '唐代边塞诗派的代表诗人。' }
      ]
      
      let poets = enrichedPoets
      if (dynasty !== 'all') {
        poets = poets.filter(poet => poet.dynasty === dynasty)
      }
      if (limit) {
        poets = poets.slice(0, limit)
      }
      return poets
    }
  }

  // 获取用户数据
  async getUsers(limit = null) {
    try {
      if (this.initialized) {
        const result = await this.mcp.query('users', {
          orderBy: { column: 'created_at', ascending: false },
          limit: limit || 100
        })
        
        if (result.success) {
          return result.data
        }
      }
      
      // 回退到空数据
      return []
    } catch (error) {
      console.error('获取用户数据失败:', error)
      return []
    }
  }

  // 通用查询方法
  async query(table, options = {}) {
    try {
      if (this.initialized) {
        return await this.mcp.query(table, options)
      }
      
      // 回退到空数据
      return { success: true, data: [] }
    } catch (error) {
      console.error(`查询失败 [${table}]:`, error)
      return { success: false, error: error.message }
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