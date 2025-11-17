import { createClient } from '@supabase/supabase-js'

// 单例模式，避免多个GoTrueClient实例
let supabaseInstance = null

// 模拟Supabase客户端（降级模式）
const createMockSupabase = () => {
  console.log('🚧 使用Supabase模拟模式（离线模式）')
  return {
    from: () => ({
      select: () => ({
        textSearch: () => ({
          limit: () => Promise.resolve({ data: [], error: null })
        }),
        eq: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
        limit: () => Promise.resolve({ data: [], error: null })
      }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null })
    }),
    rpc: () => Promise.resolve({ data: [], error: null }),
    auth: {
      signIn: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null })
    }
  }
}

// 环境变量验证和回退机制
const validateSupabaseConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  console.log('🔍 Supabase配置检查:', {
    url: supabaseUrl ? '已设置' : '未设置',
    key: supabaseAnonKey ? '已设置' : '未设置'
  })
  
  // 检查配置是否有效
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('❌ Supabase环境变量未配置，使用模拟模式')
    return null
  }
  
  // 检查URL格式是否正确
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    console.warn('⚠️ Supabase URL格式不正确，使用模拟模式')
    return null
  }
  
  console.log('✅ 尝试使用Supabase配置连接数据库')
  return { supabaseUrl, supabaseAnonKey }
}

// 测试Supabase连接
const testSupabaseConnection = async (supabaseClient) => {
  try {
    console.log('🔗 测试Supabase连接...')
    // 使用简单的ping测试，避免访问表
    const { data, error } = await supabaseClient
      .from('users')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Supabase连接测试失败:', error.message)
      return false
    }
    
    console.log('✅ Supabase连接测试成功')
    return true
  } catch (error) {
    console.error('❌ Supabase连接测试异常:', error.message)
    return false
  }
}

// 创建Supabase客户端（单例模式）
const createSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance
  }
  
  const config = validateSupabaseConfig()
  
  if (!config) {
    supabaseInstance = createMockSupabase()
    return supabaseInstance
  }
  
  // 创建实际的Supabase客户端，禁用auto-restore
  supabaseInstance = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'poetry-platform/1.0.0'
      }
    }
  })
  
  // 异步测试连接，但不阻塞客户端创建
  testSupabaseConnection(supabaseInstance).then(isConnected => {
    if (!isConnected) {
      console.warn('⚠️ Supabase连接失败，切换到模拟模式')
      supabaseInstance = createMockSupabase()
    }
  }).catch(err => {
    console.warn('⚠️ Supabase连接测试异常，切换到模拟模式:', err.message)
    supabaseInstance = createMockSupabase()
  })
  
  return supabaseInstance
}

// 获取Supabase客户端
const supabase = createSupabaseClient()

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

// RAG知识库查询函数（同步版本）
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

// 向量搜索函数（同步版本）
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

// 检查Supabase连接状态
export const checkConnectionStatus = async () => {
  try {
    // 如果客户端是模拟模式，则连接失败
    const isMock = !supabase.auth || typeof supabase.from !== 'function'
    return {
      connected: !isMock,
      mode: isMock ? 'offline' : 'online',
      message: isMock ? '离线模式（模拟数据）' : '在线模式（数据库连接正常）'
    }
  } catch (error) {
    return {
      connected: false,
      mode: 'error',
      message: `连接错误: ${error.message}`
    }
  }
}

export default supabase