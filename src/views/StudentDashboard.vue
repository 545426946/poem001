<template>
  <!-- 赏析弹窗 -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showAppreciation" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-2xl font-bold text-gray-800">{{ currentPoem?.title }}赏析</h2>
              <button @click="showAppreciation = false" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-700">作者</h3>
                <p class="text-gray-600">{{ currentPoem?.author }}（{{ currentPoem?.dynasty }}）</p>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-700">内容</h3>
                <div class="poetry-text bg-gray-50 p-4 rounded-lg">
                  {{ currentPoem?.content }}
                </div>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-700">赏析</h3>
                <p class="text-gray-600">{{ currentPoem?.appreciation || '暂无详细赏析内容' }}</p>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-700">注释</h3>
                <p class="text-gray-600">{{ currentPoem?.annotation || '暂无注释内容' }}</p>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-700">背景</h3>
                <p class="text-gray-600">{{ currentPoem?.backgroundInfo || '暂无背景信息' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- 导航栏 -->
    <nav class="bg-white/90 backdrop-blur-md shadow-2xl border-b border-white/30 fixed top-0 w-full z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <BookOpen class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold gradient-text">学生工作台</h1>
              <p class="text-xs text-gray-500">个性化诗歌学习平台</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <img :src="authStore.currentUser?.avatar" class="w-8 h-8 rounded-full border-2 border-primary-200" />
              <div>
                <p class="text-sm font-medium text-gray-800">{{ authStore.currentUser?.name }}</p>
                <p class="text-xs text-gray-500">学生</p>
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
          <h2 class="text-3xl font-bold text-gray-800 mb-2">欢迎回来，{{ authStore.currentUser?.name }}！</h2>
          <p class="text-gray-600">继续您的诗歌学习之旅</p>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>

        <!-- 统计卡片 -->
        <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="stat-card transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">学习进度</p>
                <p class="text-3xl font-bold gradient-text">{{ studentProfile.progress }}%</p>
              </div>
              <div class="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <TrendingUp class="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div class="mt-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500" :style="{ width: studentProfile.progress + '%' }"></div>
              </div>
            </div>
          </div>

          <div class="stat-card transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">已学诗歌</p>
                <p class="text-3xl font-bold text-blue-600">{{ studentProfile.studiedPoems }}</p>
              </div>
              <div class="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Book class="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-2">目标：{{ studentProfile.totalPoems }}首</p>
          </div>

          <div class="stat-card transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">平均得分</p>
                <p class="text-3xl font-bold text-purple-600">{{ studentProfile.avgScore }}</p>
              </div>
              <div class="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <Award class="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-2">优秀水平</p>
          </div>

          <div class="stat-card transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">学习连续天数</p>
                <p class="text-3xl font-bold text-orange-600">{{ studentProfile.currentStreak }}</p>
              </div>
              <div class="w-16 h-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                <Award class="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-2">保持学习习惯</p>
          </div>
        </div>

        <!-- 诗歌列表 -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-800">推荐诗歌</h3>
            <div class="flex space-x-2">
              <button class="btn-outline text-sm">全部诗歌</button>
              <button class="btn-primary text-sm">AI推荐</button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="poem in poems" :key="poem.id" class="card-hover">
              <div class="flex items-center justify-between mb-4">
                <span class="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">{{ poem.difficulty }}</span>
                <span class="text-sm text-gray-500">{{ poem.category }}</span>
              </div>
              
              <h3 class="text-xl font-bold text-gray-800 mb-2">{{ poem.title }}</h3>
              <p class="text-gray-600 mb-3">作者：{{ poem.author }}（{{ poem.dynasty }}）</p>
              
              <div class="poetry-text mb-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary-500">
                {{ poem.content }}
              </div>

              <button @click="startStudy(poem)" class="btn-primary w-full">学习</button>

              <div class="mt-3 flex flex-wrap gap-1">
                <span v-for="tag in poem.tags" :key="tag" class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { BookOpen, TrendingUp, Book, Award } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { dataService } from '@/services/dataService'


const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const poems = ref([])
const studentProfile = ref({
  progress: 0,
  studiedPoems: 0,
  avgScore: 0,
  totalPoems: 20,
  weeklyGoal: 3,
  currentStreak: 0
})
const loading = ref(true)
const showAppreciation = ref(false)
const currentPoem = ref(null)

// 生命周期
onMounted(async () => {
  await loadData()
})

// 方法
const loadData = async () => {
  loading.value = true
  try {
    // 并行加载数据
    const [profileData, poemsData] = await Promise.all([
      dataService.getStudentProfile(authStore.currentUser.id),
      dataService.getPoems()
    ])
    
    studentProfile.value = profileData
    poems.value = poemsData
  } catch (error) {
    console.error('加载数据失败:', error)
    // 使用默认数据
    studentProfile.value = {
      progress: 75,
      studiedPoems: 15,
      avgScore: 88,
      totalPoems: 20,
      weeklyGoal: 3,
      currentStreak: 7
    }
    poems.value = dataService.getSamplePoems()
  } finally {
    loading.value = false
  }
}

const analyzePoem = async (poem) => {
  const question = prompt('请输入您想了解的问题：')
  if (question) {
    const analysis = await aiService.analyzePoem(poem, question, authStore.currentUser.id)
    alert(`AI分析结果：\n\n${analysis}`)
  }
}

const startStudy = (poem) => {
  currentPoem.value = poem
  showAppreciation.value = true
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
/* 组件样式 */
.poetry-text {
  white-space: pre-line;
  line-height: 1.8;
}

/* 弹窗动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>