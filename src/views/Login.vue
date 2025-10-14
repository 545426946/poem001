<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-500"></div>
    </div>

    <div class="max-w-4xl w-full relative z-10">
      <!-- 标题区域 -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
          <Star class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-6xl font-serif font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          
        </h1>
        <p class="text-xl text-gray-700 font-medium">
          AI驱动的诗歌赏析智慧学习与管理平台
        </p>
        <p class="text-gray-500 mt-2">让诗歌学习变得简单而有趣</p>
      </div>

      <!-- 登录卡片 -->
      <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        <h2 class="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          选择您的身份
        </h2>

        <!-- 角色选择 -->
        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div
            v-for="option in roleOptions"
            :key="option.id"
            :class="[
              'p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105',
              selectedRole === option.id
                ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50 shadow-lg'
                : 'border-gray-200/50 bg-white/60 hover:border-primary-300 hover:shadow-md'
            ]"
            @click="selectedRole = option.id"
          >
            <div class="flex items-center justify-center mb-4">
              <div :class="[
                'w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300',
                selectedRole === option.id 
                  ? 'bg-gradient-to-r from-primary-500 to-blue-500 shadow-lg' 
                  : 'bg-gray-100'
              ]">
                <component :is="option.icon" :class="[
                  'w-8 h-8 transition-colors duration-300',
                  selectedRole === option.id ? 'text-white' : option.color
                ]" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-center mb-3 text-gray-800">
              {{ option.title }}
            </h3>
            <p class="text-sm text-gray-600 text-center leading-relaxed">
              {{ option.description }}
            </p>
          </div>
        </div>

        <!-- 登录按钮 -->
        <button
          @click="handleLogin"
          :class="[
            'w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg',
            'bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white',
            'focus:outline-none focus:ring-4 focus:ring-primary-200'
          ]"
        >
          <span class="flex items-center justify-center space-x-2">
            <LogIn class="w-5 h-5" />
            <span>进入{{ currentRoleTitle }}平台</span>
          </span>
        </button>

        <!-- 平台特色 -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-500">基于AI技术，提供智能化的诗歌学习体验</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { BookOpen, GraduationCap, Users, Star, LogIn } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// 角色选项配置
const roleOptions = [
  {
    id: 'student',
    title: '学生',
    description: '个性化诗歌学习与赏析',
    icon: BookOpen,
    color: 'text-blue-600'
  },
  {
    id: 'teacher',
    title: '教师',
    description: '教学管理与学情分析',
    icon: GraduationCap,
    color: 'text-green-600'
  },
  {
    id: 'college',
    title: '学院管理',
    description: '全局数据洞察与决策支持',
    icon: Users,
    color: 'text-purple-600'
  }
]

// 响应式数据
const selectedRole = ref('student')

// 计算属性
const currentRoleTitle = computed(() => {
  return roleOptions.find(r => r.id === selectedRole.value)?.title || '平台'
})

// 登录处理
const handleLogin = () => {
  const userData = {
    id: selectedRole.value === 'student' ? 'S2023001' : 
         selectedRole.value === 'teacher' ? 'T2023001' : 'A2023001',
    name: selectedRole.value === 'student' ? '张三' : 
          selectedRole.value === 'teacher' ? '李老师' : '王院长',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRole.value}`
  }
  
  // 调用store的登录方法
  authStore.login(userData, selectedRole.value)
  
  // 根据角色跳转到对应页面
  const route = selectedRole.value === 'student' ? '/student' :
                selectedRole.value === 'teacher' ? '/teacher' : '/college'
  
  router.push(route)
}
</script>

<style scoped>
/* 组件样式 */
</style>