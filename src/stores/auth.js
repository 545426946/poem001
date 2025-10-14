import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref(null)
  const role = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(true)

  // Getters
  const currentUser = computed(() => user.value)
  const currentRole = computed(() => role.value)
  const isLoggedIn = computed(() => isAuthenticated.value)

  // Actions
  const login = (userData, userRole) => {
    // 确保用户数据包含默认头像
    const userWithDefaults = {
      ...userData,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || 'default'}`
    }
    
    user.value = userWithDefaults
    role.value = userRole
    isAuthenticated.value = true
    
    // 保存到本地存储
    localStorage.setItem('poetry_platform_user', JSON.stringify(userWithDefaults))
    localStorage.setItem('poetry_platform_role', userRole)
  }

  const logout = () => {
    user.value = null
    role.value = null
    isAuthenticated.value = false
    
    // 清除本地存储
    localStorage.removeItem('poetry_platform_user')
    localStorage.removeItem('poetry_platform_role')
  }

  const initializeAuth = () => {
    const savedUser = localStorage.getItem('poetry_platform_user')
    const savedRole = localStorage.getItem('poetry_platform_role')
    
    if (savedUser && savedRole) {
      user.value = JSON.parse(savedUser)
      role.value = savedRole
      isAuthenticated.value = true
    }
    
    loading.value = false
  }

  return {
    // 状态
    user,
    role,
    isAuthenticated,
    loading,
    
    // Getters
    currentUser,
    currentRole,
    isLoggedIn,
    
    // Actions
    login,
    logout,
    initializeAuth
  }
})