import { createClient } from '@supabase/supabase-js'

// 环境变量验证和回退机制
const validateSupabaseConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  console.log('Supabase配置检查:', {
    url: supabaseUrl ? '已设置' : '未设置',
    key: supabaseAnonKey ? '已设置' : '未设置'
  })
  
  // 更宽松的验证，允许在Netlify上使用
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase环境变量未配置，使用模拟模式')
    return null
  }
  
  // 即使配置看起来不太完美也尝试连接
  console.log('尝试使用Supabase配置连接数据库')
  return { supabaseUrl, supabaseAnonKey }
}

const config = validateSupabaseConfig()

// 创建Supabase客户端或返回模拟客户端
export const supabase = config ? createClient(config.supabaseUrl, config.supabaseAnonKey) : {
  // 模拟Supabase客户端
  from: () => ({
    select: () => ({
      textSearch: () => ({
        limit: () => Promise.resolve({ data: [], error: null })
      })
    })
  }),
  rpc: () => Promise.resolve({ data: [], error: null })
}

// 数据表结构定义
export const TABLES = {
  USERS: 'users',
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  COURSES: 'courses',
  ENROLLMENTS: 'enrollments',
  ASSIGNMENTS: 'assignments',
  GRADES: 'grades',
  LEARNING_PATHS: 'learning_paths',
  KNOWLEDGE_BASE: 'knowledge_base_chunks',
  LEARNING_ACTIVITIES: 'student_learning_activities',
  AI_AGENT_STATE: 'ai_agent_state'
}

// RAG知识库查询函数
export const searchKnowledgeBase = async (query, limit = 5) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.KNOWLEDGE_BASE)
      .select('*')
      .textSearch('content', query)
      .limit(limit)
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('知识库查询失败:', error)
    return []
  }
}

// 向量搜索函数
export const vectorSearch = async (embedding, limit = 5) => {
  try {
    const { data, error } = await supabase
      .rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: limit
      })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('向量搜索失败:', error)
    return []
  }
}

export default supabase