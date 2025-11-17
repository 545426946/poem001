// 环境变量验证工具
export function validateEnv() {
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ]
  
  // 检查环境变量是否存在且有效
  const missingVars = requiredEnvVars.filter(varName => {
    const value = import.meta.env[varName]
    return !value || value.trim() === '' || value.includes('your_')
  })
  
  if (missingVars.length > 0) {
    console.warn('缺少必要的环境变量:', missingVars)
    console.log('当前环境变量状态:', {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '已设置' : '未设置',
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '已设置' : '未设置'
    })
    return false
  }
  
  console.log('✅ 环境变量验证通过')
  return true
}

// 获取环境变量
export function getEnvVar(key, defaultValue = '') {
  return import.meta.env[key] || defaultValue
}

// 检查是否为生产环境
export const isProduction = import.meta.env.PROD

// 获取Supabase配置
export function getSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    console.warn('Supabase配置缺失，使用模拟模式')
    return null
  }
  
  return { url, key }
}