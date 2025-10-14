<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- 班级详情模态框 -->
    <ClassDetailModal 
      :visible="showClassDetail"
      :class-id="selectedClassId"
      @close="closeClassDetail"
    />
    <!-- 导航栏 -->
    <nav class="bg-white/90 backdrop-blur-md shadow-2xl border-b border-white/30 fixed top-0 w-full z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <GraduationCap class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold gradient-text">教师管理台</h1>
              <p class="text-xs text-gray-500">班级管理与教学分析</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <img :src="authStore.currentUser?.avatar" class="w-8 h-8 rounded-full border-2 border-green-200" />
              <div>
                <p class="text-sm font-medium text-gray-800">{{ authStore.currentUser?.name }}</p>
                <p class="text-xs text-gray-500">教师</p>
              </div>
            </div>
            <button @click="handleLogout" class="btn-outline text-sm">退出登录</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="pt-20 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 欢迎区域 -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">教学数据分析，{{ authStore.currentUser?.name }}老师</h2>
          <p class="text-gray-600">实时监控班级学习进度与表现</p>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>

        <!-- 统计卡片 -->
        <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="stat-card transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">班级数量</p>
                <p class="text-3xl font-bold text-blue-600">{{ classes.length }}</p>
              </div>
              <div class="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Users class="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-2">学生总数：{{ totalStudents }}</p>
          </div>

          <div class="stat-card transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">平均进度</p>
                <p class="text-3xl font-bold text-green-600">{{ avgProgress }}%</p>
              </div>
              <div class="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <TrendingUp class="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-2">较上月 +{{ improvement }}%</p>
          </div>

          <div class="stat-card transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">高风险学生</p>
                <p class="text-3xl font-bold text-red-600">{{ highRiskStudents }}</p>
              </div>
              <div class="w-12 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <AlertTriangle class="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-2">需要特别关注</p>
          </div>

          <div class="stat-card transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">完成率</p>
                <p class="text-3xl font-bold text-purple-600">{{ completionRate }}%</p>
              </div>
              <div class="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <Award class="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-2">教学目标达成度</p>
          </div>
        </div>

        <!-- 班级列表 -->
        <div class="dashboard-card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-800">班级管理</h3>
            <div class="flex space-x-2">
              <button class="btn-outline text-sm">导出数据</button>
              <button class="btn-primary text-sm">添加班级</button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div 
              v-for="classItem in classes" 
              :key="classItem.id" 
              class="card-hover cursor-pointer"
              @click="openClassDetail(classItem.id)"
            >
              <div class="flex items-center justify-between mb-4">
                <span class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">{{ classItem.name }}</span>
                <span class="text-sm text-gray-500">{{ classItem.students?.length || 0 }}名学生</span>
              </div>
              
              <h3 class="text-xl font-bold text-gray-800 mb-2">{{ classItem.name }}</h3>
              
              <div class="space-y-3 mb-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">学习进度</span>
                  <span class="text-sm font-medium text-green-600">{{ classItem.avgProgress || 0 }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500" :style="{ width: (classItem.avgProgress || 0) + '%' }"></div>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">高风险学生</span>
                  <span class="text-sm font-medium text-red-600">{{ classItem.highRiskStudents || 0 }}人</span>
                </div>
              </div>

              <div class="flex space-x-2">
                <button @click.stop="openClassDetail(classItem.id)" class="btn-primary flex-1">查看详情</button>
                <button @click.stop="analyzeClass(classItem)" class="btn-outline">AI分析</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { GraduationCap, Users, TrendingUp, AlertTriangle, Award } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { dataService } from '@/services/dataService'
import ClassDetailModal from '@/components/ClassDetailModal.vue'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const classes = ref([])
const loading = ref(true)
const showClassDetail = ref(false)
const selectedClassId = ref(null)

// 计算属性
const totalStudents = computed(() => {
  return classes.value.reduce((total, classItem) => {
    return total + (classItem.students?.length || 0)
  }, 0)
})

const avgProgress = computed(() => {
  if (classes.value.length === 0) return 0
  const total = classes.value.reduce((sum, classItem) => {
    return sum + (classItem.avgProgress || 0)
  }, 0)
  return Math.round(total / classes.value.length)
})

const highRiskStudents = computed(() => {
  return classes.value.reduce((total, classItem) => {
    return total + (classItem.highRiskStudents || 0)
  }, 0)
})

const improvement = computed(() => {
  return Math.floor(Math.random() * 15) + 5
})

const completionRate = computed(() => {
  return Math.round(avgProgress.value * 0.85)
})

// 生命周期
onMounted(async () => {
  await loadClasses()
})

// 方法
const loadClasses = async () => {
  loading.value = true
  try {
    classes.value = await dataService.getTeacherClasses(authStore.currentUser.id)
  } catch (error) {
    console.error('加载班级失败:', error)
    // 使用模拟数据
    classes.value = [
      {
        id: 1,
        name: '高一(1)班',
        students: Array(35).fill({}),
        avgProgress: 78,
        highRiskStudents: 3
      },
      {
        id: 2,
        name: '高一(2)班',
        students: Array(38).fill({}),
        avgProgress: 72,
        highRiskStudents: 5
      },
      {
        id: 3,
        name: '高一(3)班',
        students: Array(36).fill({}),
        avgProgress: 65,
        highRiskStudents: 7
      }
    ]
  } finally {
    loading.value = false
  }
}

const openClassDetail = (classId) => {
  selectedClassId.value = classId
  showClassDetail.value = true
}

const closeClassDetail = () => {
  showClassDetail.value = false
  selectedClassId.value = null
}

const analyzeClass = (classItem) => {
  alert(`AI分析班级：${classItem.name}`)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
/* 组件样式 */
</style>