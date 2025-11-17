/**
 * Supabase MCP (Model Context Protocol) 配置
 * 提供标准化的Supabase连接管理和数据操作接口
 */

import { createClient } from '@supabase/supabase-js'

// MCP配置类
class SupabaseMCP {
  constructor() {
    this.client = null
    this.isConnected = false
    this.config = {
      url: this._getEnvVar('VITE_SUPABASE_URL'),
      anonKey: this._getEnvVar('VITE_SUPABASE_ANON_KEY'),
      options: {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      }
    }
  }

  // 安全获取环境变量
  _getEnvVar(varName) {
    try {
      // 浏览器环境
      if (typeof window !== 'undefined' && import.meta && import.meta.env) {
        return import.meta.env[varName]
      }
      // Node.js环境或无法访问环境变量时
      return process?.env?.[varName] || ''
    } catch (error) {
      console.warn(`无法获取环境变量 ${varName}:`, error)
      return ''
    }
  }

  // 初始化连接
  async initialize() {
    try {
      if (!this.config.url || !this.config.anonKey) {
        throw new Error('Supabase配置不完整，请检查环境变量')
      }

      this.client = createClient(this.config.url, this.config.anonKey, this.config.options)
      
      // 测试连接
      const { data, error } = await this.client.from('users').select('count').limit(1)
      
      if (error) {
        console.warn('Supabase连接测试失败，使用离线模式:', error.message)
        this.isConnected = false
      } else {
        this.isConnected = true
        console.log('Supabase MCP连接成功')
      }
      
      return this.isConnected
    } catch (error) {
      console.error('Supabase MCP初始化失败:', error)
      this.isConnected = false
      return false
    }
  }

  // 获取客户端实例
  getClient() {
    if (!this.client) {
      throw new Error('Supabase MCP未初始化，请先调用initialize()方法')
    }
    return this.client
  }

  // 标准查询方法
  async query(table, options = {}) {
    try {
      if (!this.isConnected) {
        throw new Error('Supabase连接不可用')
      }

      const {
        select = '*',
        where = {},
        orderBy = { column: 'created_at', ascending: false },
        limit = null,
        offset = 0
      } = options

      let query = this.client.from(table).select(select)

      // 应用where条件
      Object.keys(where).forEach(key => {
        if (where[key] !== undefined && where[key] !== null) {
          query = query.eq(key, where[key])
        }
      })

      // 应用排序
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending })
      }

      // 应用分页
      if (limit) {
        query = query.range(offset, offset + limit - 1)
      }

      const { data, error } = await query

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error(`MCP查询失败 [${table}]:`, error)
      return { success: false, error: error.message }
    }
  }

  // 插入数据
  async insert(table, data) {
    try {
      if (!this.isConnected) {
        throw new Error('Supabase连接不可用')
      }

      const { data: result, error } = await this.client
        .from(table)
        .insert(data)
        .select()

      if (error) throw error
      return { success: true, data: result }
    } catch (error) {
      console.error(`MCP插入失败 [${table}]:`, error)
      return { success: false, error: error.message }
    }
  }

  // 更新数据
  async update(table, where, data) {
    try {
      if (!this.isConnected) {
        throw new Error('Supabase连接不可用')
      }

      let query = this.client.from(table).update(data)

      // 应用where条件
      Object.keys(where).forEach(key => {
        if (where[key] !== undefined && where[key] !== null) {
          query = query.eq(key, where[key])
        }
      })

      const { data: result, error } = await query.select()

      if (error) throw error
      return { success: true, data: result }
    } catch (error) {
      console.error(`MCP更新失败 [${table}]:`, error)
      return { success: false, error: error.message }
    }
  }

  // 删除数据
  async delete(table, where) {
    try {
      if (!this.isConnected) {
        throw new Error('Supabase连接不可用')
      }

      let query = this.client.from(table).delete()

      // 应用where条件
      Object.keys(where).forEach(key => {
        if (where[key] !== undefined && where[key] !== null) {
          query = query.eq(key, where[key])
        }
      })

      const { error } = await query

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error(`MCP删除失败 [${table}]:`, error)
      return { success: false, error: error.message }
    }
  }

  // 实时订阅
  subscribe(table, event, callback, filter = {}) {
    try {
      if (!this.isConnected) {
        throw new Error('Supabase连接不可用')
      }

      return this.client
        .channel('mcp-channel')
        .on('postgres_changes', {
          event,
          schema: 'public',
          table,
          filter
        }, callback)
        .subscribe()
    } catch (error) {
      console.error(`MCP订阅失败 [${table}]:`, error)
      return null
    }
  }

  // RAG搜索
  async ragSearch(query, options = {}) {
    try {
      if (!this.isConnected) {
        throw new Error('Supabase连接不可用')
      }

      const {
        table = 'knowledge_base_chunks',
        searchColumn = 'content',
        limit = 5,
        threshold = 0.7
      } = options

      const { data, error } = await this.client
        .from(table)
        .select('*')
        .textSearch(searchColumn, query)
        .limit(limit)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('MCP RAG搜索失败:', error)
      return { success: false, error: error.message }
    }
  }

  // 向量搜索
  async vectorSearch(embedding, options = {}) {
    try {
      if (!this.isConnected) {
        throw new Error('Supabase连接不可用')
      }

      const {
        table = 'documents',
        vectorColumn = 'embedding',
        limit = 5,
        threshold = 0.7
      } = options

      const { data, error } = await this.client
        .rpc('match_documents', {
          query_embedding: embedding,
          match_threshold: threshold,
          match_count: limit
        })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('MCP向量搜索失败:', error)
      return { success: false, error: error.message }
    }
  }

  // 健康检查
  async healthCheck() {
    try {
      if (!this.isConnected) {
        return { healthy: false, message: '未连接' }
      }

      const { error } = await this.client.from('users').select('count').limit(1)
      
      if (error) {
        return { healthy: false, message: error.message }
      }
      
      return { healthy: true, message: '连接正常' }
    } catch (error) {
      return { healthy: false, message: error.message }
    }
  }

  // 断开连接
  disconnect() {
    if (this.client) {
      this.client.removeAllChannels()
      this.client = null
      this.isConnected = false
      console.log('Supabase MCP已断开连接')
    }
  }
}

// 创建全局MCP实例
const supabaseMCP = new SupabaseMCP()

// 导出MCP实例和工具函数
export default supabaseMCP
export { SupabaseMCP }