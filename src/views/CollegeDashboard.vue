<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
    <!-- 大屏标题 -->
    <div class="bg-gray-800/90 backdrop-blur-md border-b border-gray-700/50 shadow-2xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
              <Users class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">学院数据大屏</h1>
              <p class="text-gray-400">实时数据监控与分析</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3 bg-gray-700/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <img :src="authStore.currentUser?.avatar" class="w-8 h-8 rounded-full border-2 border-purple-400" />
              <div>
                <p class="text-sm font-medium text-white">{{ authStore.currentUser?.name }}</p>
                <p class="text-xs text-gray-400">学院管理员</p>
              </div>
            </div>
            <button @click="handleLogout" class="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 border border-gray-600">退出登录</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
    </div>

    <!-- 核心指标 -->
    <div v-else class="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 text-center shadow-2xl border border-gray-700/50 transform hover:scale-105 transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30 mx-auto mb-4">
            <Users class="w-8 h-8 text-blue-400" />
          </div>
          <h3 class="text-lg text-gray-400 mb-2">学生总数</h3>
          <p class="text-4xl font-bold text-blue-400">{{ overview.totalStudents }}</p>
          <p class="text-sm text-gray-500 mt-2">较上月 +{{ studentGrowth }}%</p>
        </div>
        <div class="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 text-center shadow-2xl border border-gray-700/50 transform hover:scale-105 transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center border border-green-500/30 mx-auto mb-4">
            <GraduationCap class="w-8 h-8 text-green-400" />
          </div>
          <h3 class="text-lg text-gray-400 mb-2">教师总数</h3>
          <p class="text-4xl font-bold text-green-400">{{ overview.totalTeachers }}</p>
          <p class="text-sm text-gray-500 mt-2">活跃教师：{{ activeTeachers }}</p>
        </div>
        <div class="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 text-center shadow-2xl border border-gray-700/50 transform hover:scale-105 transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-purple-500/30 mx-auto mb-4">
            <BookOpen class="w-8 h-8 text-purple-400" />
          </div>
          <h3 class="text-lg text-gray-400 mb-2">活跃班级</h3>
          <p class="text-4xl font-bold text-purple-400">{{ overview.activeClasses }}</p>
          <p class="text-sm text-gray-500 mt-2">总班级：{{ totalClasses }}</p>
        </div>
        <div class="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 text-center shadow-2xl border border-gray-700/50 transform hover:scale-105 transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-full flex items-center justify-center border border-yellow-500/30 mx-auto mb-4">
            <TrendingUp class="w-8 h-8 text-yellow-400" />
          </div>
          <h3 class="text-lg text-gray-400 mb-2">平均完成度</h3>
          <p class="text-4xl font-bold text-yellow-400">{{ overview.avgCompletion }}%</p>
          <p class="text-sm text-gray-500 mt-2">目标：85%</p>
        </div>
      </div>

      <!-- 数据图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 学习进度分布 -->
        <div class="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-700/50">
          <h3 class="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 class="w-5 h-5 text-blue-400 mr-2" />
            学习进度分布
          </h3>
          <div class="space-y-3">
            <div v-for="item in progressDistribution" :key="item.range" class="flex items-center justify-between">
              <span class="text-gray-300">{{ item.range }}</span>
              <div class="flex items-center space-x-3">
                <div class="w-32 bg-gray-700 rounded-full h-3">
                  <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" :style="{ width: item.percentage + '%' }"></div>
                </div>
                <span class="text-sm font-medium text-blue-400">{{ item.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 高风险学生预警 -->
        <div class="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-700/50">
          <h3 class="text-xl font-semibold mb-4 flex items-center">
            <AlertTriangle class="w-5 h-5 text-red-400 mr-2" />
            高风险学生预警
          </h3>
          <div class="space-y-3">
            <div v-for="student in highRiskStudents" :key="student.id" class="flex items-center justify-between p-3 bg-red-900/30 rounded-lg border border-red-500/20">
              <div>
                <span class="font-medium text-white">{{ student.name }}</span>
                <span class="text-sm text-gray-400 ml-2">{{ student.class }}</span>
              </div>
              <span class="text-red-400 font-medium bg-red-900/50 px-2 py-1 rounded">进度 {{ student.progress }}%</span>
            </div>
          </div>
        </div>

        <!-- 诗歌学习热度 -->
        <div class="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-700/50">
          <h3 class="text-xl font-semibold mb-4 flex items-center">
            <Book class="w-5 h-5 text-green-400 mr-2" />
            热门诗歌排行
          </h3>
          <div class="space-y-3">
            <div v-for="(poem, index) in popularPoems" :key="poem.id" class="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200">
              <div class="flex items-center space-x-3">
                <span class="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {{ index + 1 }}
                </span>
                <span class="font-medium">{{ poem.title }}</span>
              </div>
              <span class="text-green-400 font-medium bg-green-900/30 px-2 py-1 rounded">{{ poem.studyCount }}次学习</span>
            </div>
          </div>
        </div>

        <!-- 教师教学统计 -->
        <div class="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-700/50">
          <h3 class="text-xl font-semibold mb-4 flex items-center">
            <Award class="w-5 h-5 text-purple-400 mr-2" />
            教师教学统计
          </h3>
          <div class="space-y-3">
            <div v-for="teacher in teacherStats" :key="teacher.id" class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-purple-500/30">
                  <GraduationCap class="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <span class="font-medium">{{ teacher.name }}</span>
                  <p class="text-xs text-gray-400">{{ teacher.classes }}个班级</p>
                </div>
              </div>
              <span class="text-green-400 font-medium bg-green-900/30 px-3 py-1 rounded-full">平均{{ teacher.avgProgress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Users, GraduationCap, BookOpen, TrendingUp, BarChart3, AlertTriangle, Book, Award } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { dataService } from '@/services/dataService'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(true)
const overview = ref({
  totalStudents: 0,
  totalTeachers: 0,
  activeClasses: 0,
  avgCompletion: 0,
  highRiskStudents: 0,
  totalPoemsStudied: 0
})

const progressDistribution = ref([])
const highRiskStudents = ref([])
const popularPoems = ref([])
const teacherStats = ref([])

// 计算属性
const studentGrowth = computed(() => {
  return Math.floor(Math.random() * 8) + 2
})

const activeTeachers = computed(() => {
  return Math.floor(overview.value.totalTeachers * 0.85)
})

const totalClasses = computed(() => {
  return Math.floor(overview.value.totalStudents / 40)
})

// 生命周期
onMounted(async () => {
  await loadCollegeData()
})

// 方法
const loadCollegeData = async () => {
  loading.value = true
  try {
    overview.value = await dataService.getCollegeOverview()
    
    // 模拟其他数据
    progressDistribution.value = [
      { range: '0-20%', percentage: 8 },
      { range: '21-40%', percentage: 15 },
      { range: '41-60%', percentage: 22 },
      { range: '61-80%', percentage: 35 },
      { range: '81-100%', percentage: 28 }
    ]
    
    highRiskStudents.value = [
      { id: 1, name: '张三', class: '高一(1)班', progress: 15 },
      { id: 2, name: '李四', class: '高一(2)班', progress: 22 },
      { id: 3, name: '王五', class: '高一(3)班', progress: 18 },
      { id: 4, name: '赵六', class: '高一(4)班', progress: 12 },
      { id: 5, name: '孙七', class: '高二(1)班', progress: 25 }
    ]
    
    popularPoems.value = [
      { id: 1, title: '静夜思', studyCount: 1856 },
      { id: 2, title: '春晓', studyCount: 1642 },
      { id: 3, title: '登鹳雀楼', studyCount: 1428 },
      { id: 4, title: '相思', studyCount: 1315 },
      { id: 5, title: '望庐山瀑布', studyCount: 1198 }
    ]
    
    teacherStats.value = [
      { id: 1, name: '李明老师', classes: 3, avgProgress: 82 },
      { id: 2, name: '王芳老师', classes: 2, avgProgress: 85 },
      { id: 3, name: '张伟老师', classes: 4, avgProgress: 78 },
      { id: 4, name: '刘丽老师', classes: 3, avgProgress: 80 },
      { id: 5, name: '陈强老师', classes: 2, avgProgress: 88 }
    ]
  } catch (error) {
    console.error('加载学院数据失败:', error)
    // 使用默认数据
    overview.value = {
      totalStudents: 1600,
      totalTeachers: 45,
      activeClasses: 32,
      avgCompletion: 78,
      highRiskStudents: 128,
      totalPoemsStudied: 24000
    }
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
/* 大屏专用样式 */
</style>