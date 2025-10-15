/**
 * MCP全局配置
 * 统一管理所有MCP相关的配置和常量
 */

// MCP功能开关
export const MCP_FEATURES = {
  // 数据服务功能
  DATA_SERVICE: true,
  REAL_TIME_UPDATES: true,
  RAG_SEARCH: true,
  VECTOR_SEARCH: false, // 需要向量扩展支持
  ANALYTICS: true,
  
  // 性能优化
  CACHING: true,
  RETRY_MECHANISM: true,
  OFFLINE_MODE: true,
  
  // 监控功能
  HEALTH_MONITORING: true,
  PERFORMANCE_LOGGING: true
}

// MCP表名映射
export const MCP_TABLES = {
  // 用户相关
  USERS: 'users',
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  
  // 教学相关
  CLASSES: 'classes',
  COURSES: 'courses',
  ENROLLMENTS: 'enrollments',
  ASSIGNMENTS: 'assignments',
  GRADES: 'grades',
  
  // 学习相关
  LEARNING_PATHS: 'learning_paths',
  LEARNING_ACTIVITIES: 'student_learning_activities',
  
  // 知识库
  KNOWLEDGE_BASE: 'knowledge_base_chunks',
  DOCUMENTS: 'documents',
  
  // AI相关
  AI_AGENT_STATE: 'ai_agent_state',
  AI_CONVERSATIONS: 'ai_conversations'
}

// MCP查询配置
export const MCP_QUERY_CONFIG = {
  // 默认查询限制
  DEFAULT_LIMIT: 100,
  MAX_LIMIT: 1000,
  
  // 分页配置
  PAGE_SIZE: 20,
  
  // 重试配置
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  // 超时配置
  QUERY_TIMEOUT: 30000,
  CONNECTION_TIMEOUT: 10000
}

// MCP缓存配置
export const MCP_CACHE_CONFIG = {
  // 缓存时间（毫秒）
  USER_PROFILE_TTL: 5 * 60 * 1000, // 5分钟
  STUDENT_DATA_TTL: 10 * 60 * 1000, // 10分钟
  CLASS_DATA_TTL: 15 * 60 * 1000, // 15分钟
  POEMS_DATA_TTL: 30 * 60 * 1000, // 30分钟
  
  // 缓存大小限制
  MAX_CACHE_SIZE: 1000,
  
  // 清理间隔
  CLEANUP_INTERVAL: 60 * 1000 // 1分钟
}

// MCP错误代码
export const MCP_ERROR_CODES = {
  // 连接错误
  CONNECTION_FAILED: 'MCP_001',
  AUTH_FAILED: 'MCP_002',
  TIMEOUT: 'MCP_003',
  
  // 查询错误
  QUERY_FAILED: 'MCP_101',
  INVALID_PARAMS: 'MCP_102',
  PERMISSION_DENIED: 'MCP_103',
  
  // 数据错误
  DATA_VALIDATION: 'MCP_201',
  UNIQUE_CONSTRAINT: 'MCP_202',
  FOREIGN_KEY: 'MCP_203',
  
  // 系统错误
  UNKNOWN_ERROR: 'MCP_999'
}

// MCP事件类型
export const MCP_EVENTS = {
  // 连接事件
  CONNECTED: 'mcp_connected',
  DISCONNECTED: 'mcp_disconnected',
  RECONNECTING: 'mcp_reconnecting',
  
  // 数据事件
  DATA_UPDATED: 'mcp_data_updated',
  DATA_INSERTED: 'mcp_data_inserted',
  DATA_DELETED: 'mcp_data_deleted',
  
  // 错误事件
  ERROR_OCCURRED: 'mcp_error',
  HEALTH_CHANGED: 'mcp_health_changed'
}

// MCP性能监控配置
export const MCP_MONITORING = {
  // 性能阈值（毫秒）
  SLOW_QUERY_THRESHOLD: 1000,
  CRITICAL_QUERY_THRESHOLD: 5000,
  
  // 健康检查间隔
  HEALTH_CHECK_INTERVAL: 30 * 1000, // 30秒
  
  // 指标收集
  COLLECT_METRICS: true,
  METRICS_RETENTION: 24 * 60 * 60 * 1000 // 24小时
}

export default {
  FEATURES: MCP_FEATURES,
  TABLES: MCP_TABLES,
  QUERY_CONFIG: MCP_QUERY_CONFIG,
  CACHE_CONFIG: MCP_CACHE_CONFIG,
  ERROR_CODES: MCP_ERROR_CODES,
  EVENTS: MCP_EVENTS,
  MONITORING: MCP_MONITORING
}