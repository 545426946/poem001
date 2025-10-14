import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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