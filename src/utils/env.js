// 环境变量验证工具
export function validateEnv() {
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ]
  
  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName])
  
  if (missingVars.length > 0) {
    console.warn('缺少必要的环境变量:', missingVars)
    return false
  }
  
  return true
}

// 获取环境变量
export function getEnvVar(key, defaultValue = '') {
  return import.meta.env[key] || defaultValue
}

// 检查是否为生产环境
export const isProduction = import.meta.env.PROD