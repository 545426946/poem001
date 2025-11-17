<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20">
      <!-- 头部 -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">{{ classData?.name }}</h2>
            <p class="text-blue-100 mt-1">班级详情 · {{ classData?.academicYear }}</p>
          </div>
          <button 
            @click="$emit('close')"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="classData" class="space-y-6">
          <!-- 班级基本信息 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-blue-500 rounded-lg">
                  <Users class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="text-sm text-gray-600">学生总数</p>
                  <p class="text-xl font-bold text-blue-600">{{ classData.totalStudents }}</p>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-green-500 rounded-lg">
                  <TrendingUp class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="text-sm text-gray-600">平均进度</p>
                  <p class="text-xl font-bold text-green-600">{{ classData.avgProgress }}%</p>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-red-500 rounded-lg">
                  <AlertTriangle class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="text-sm text-gray-600">高风险学生</p>
                  <p class="text-xl font-bold text-red-600">{{ classData.highRiskStudents }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 班主任信息 -->
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User class="w-5 h-5 mr-2 text-purple-600" />
              班主任信息
            </h3>
            <div v-if="classData.teacher" class="flex items-center space-x-4">
              <img 
                :src="classData.teacher.avatar" 
                :alt="classData.teacher.name"
                class="w-16 h-16 rounded-full border-4 border-white shadow-lg"
              >
              <div>
                <h4 class="text-xl font-bold text-gray-800">{{ classData.teacher.name }}</h4>
                <p class="text-gray-600">{{ classData.teacher.title }} · {{ classData.teacher.department }}</p>
                <p class="text-sm text-gray-500 mt-1">
                  <Mail class="w-4 h-4 inline mr-1" />
                  {{ classData.teacher.email }}
                </p>
                <p class="text-sm text-gray-500">
                  <Phone class="w-4 h-4 inline mr-1" />
                  {{ classData.teacher.phone }}
                </p>
              </div>
            </div>
          </div>

          <!-- 学生列表 -->
          <div class="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <Users class="w-5 h-5 mr-2 text-blue-600" />
                班级学生 ({{ students.length }})
              </h3>
              <div class="flex items-center space-x-2">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索学生..."
                  class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                <Search class="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              <div 
                v-for="student in filteredStudents" 
                :key="student.id"
                class="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div class="flex items-center space-x-3">
                  <img 
                    :src="student.avatar" 
                    :alt="student.name"
                    class="w-12 h-12 rounded-full border-2 border-gray-200"
                  >
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-800">{{ student.name }}</h4>
                    <p class="text-sm text-gray-600">{{ student.id }}</p>
                    <div class="flex items-center mt-2">
                      <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          class="h-2 rounded-full transition-all duration-300"
                          :class="getProgressColor(student.progress)"
                          :style="{ width: `${student.progress}%` }"
                        ></div>
                      </div>
                      <span class="ml-2 text-xs font-medium text-gray-600">{{ student.progress }}%</span>
                    </div>
                  </div>
                </div>
                
                <div class="mt-3 flex justify-between text-xs text-gray-500">
                  <span>已学: {{ student.studiedPoems }}首</span>
                  <span>均分: {{ student.avgScore }}</span>
                </div>
              </div>
            </div>

            <div v-if="filteredStudents.length === 0" class="text-center py-8 text-gray-500">
              <Users class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>没有找到匹配的学生</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X, Users, TrendingUp, AlertTriangle, User, Mail, Phone, Search } from 'lucide-vue-next'
import dataService from '../services/dataService'

const props = defineProps({
  visible: Boolean,
  classId: [String, Number]
})

const emit = defineEmits(['close'])

const loading = ref(false)
const classData = ref(null)
const students = ref([])
const searchQuery = ref('')

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value
  
  const query = searchQuery.value.toLowerCase()
  return students.value.filter(student => 
    student.name.toLowerCase().includes(query) ||
    student.id.toLowerCase().includes(query)
  )
})

const getProgressColor = (progress) => {
  if (progress >= 80) return 'bg-green-500'
  if (progress >= 60) return 'bg-blue-500'
  if (progress >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

const loadClassData = async () => {
  if (!props.classId) return
  
  loading.value = true
  try {
    const [classInfo, classStudents] = await Promise.all([
      dataService.getClassDetails(props.classId),
      dataService.getClassStudents(props.classId)
    ])
    
    classData.value = classInfo
    students.value = classStudents
  } catch (error) {
    console.error('加载班级数据失败:', error)
  } finally {
    loading.value = false
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal && props.classId) {
    loadClassData()
    searchQuery.value = ''
  }
})
</script>