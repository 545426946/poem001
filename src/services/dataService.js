import { supabase, TABLES } from '../config/supabase'
import { mockDataService } from './mockDataService'

class DataService {
  // 学生相关操作
  async getStudentProfile(studentId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.STUDENTS)
        .select('*')
        .eq('id', studentId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('获取学生档案失败:', error)
      // 返回模拟数据
      return {
        id: studentId,
        name: '张三',
        class: '高一(1)班',
        progress: 75,
        studiedPoems: 15,
        avgScore: 88,
        totalPoems: 20,
        weeklyGoal: 3,
        currentStreak: 7
      }
    }
  }

  async getStudentLearningProgress(studentId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.LEARNING_ACTIVITIES)
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('获取学习进度失败:', error)
      return []
    }
  }

  async updateStudentProgress(studentId, poemId, score) {
    try {
      const { data, error } = await supabase
        .from(TABLES.LEARNING_ACTIVITIES)
        .insert({
          student_id: studentId,
          poem_id: poemId,
          activity_type: 'poem_study',
          score: score,
          duration: 30
        })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('更新学习进度失败:', error)
      return null
    }
  }

  // 教师相关操作
  async getTeacherClasses(teacherId) {
    try {
      // 优先使用模拟数据服务
      return await mockDataService.getClassesByTeacher(teacherId)
    } catch (error) {
      console.error('获取教师班级失败:', error)
      return []
    }
  }

  // 获取班级详情
  async getClassDetails(classId) {
    try {
      return await mockDataService.getClass(classId)
    } catch (error) {
      console.error('获取班级详情失败:', error)
      return null
    }
  }

  // 获取班级学生列表
  async getClassStudents(classId) {
    try {
      return await mockDataService.getStudentsByClass(classId)
    } catch (error) {
      console.error('获取班级学生失败:', error)
      return []
    }
  }

  // 获取所有班级
  async getAllClasses() {
    try {
      return await mockDataService.getClasses()
    } catch (error) {
      console.error('获取所有班级失败:', error)
      return []
    }
  }

  // 获取高风险学生
  async getHighRiskStudents() {
    try {
      return await mockDataService.getHighRiskStudents()
    } catch (error) {
      console.error('获取高风险学生失败:', error)
      return []
    }
  }

  // 获取热门诗歌
  async getPopularPoems() {
    try {
      return await mockDataService.getPopularPoems()
    } catch (error) {
      console.error('获取热门诗歌失败:', error)
      return []
    }
  }

  // 获取教师统计
  async getTeacherStats() {
    try {
      return await mockDataService.getTeacherStats()
    } catch (error) {
      console.error('获取教师统计失败:', error)
      return []
    }
  }

  // 学院级数据
  async getCollegeOverview() {
    try {
      return await mockDataService.getCollegeOverview()
    } catch (error) {
      console.error('获取学院概览失败:', error)
      return {
        totalStudents: 1600,
        totalTeachers: 45,
        activeClasses: 32,
        avgCompletion: 78,
        highRiskStudents: 128,
        totalPoemsStudied: 24000
      }
    }
  }

  async getTotalStudents() {
    try {
      const { count, error } = await supabase
        .from(TABLES.STUDENTS)
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      return count || 1600
    } catch (error) {
      return 1600
    }
  }

  async getTotalTeachers() {
    try {
      const { count, error } = await supabase
        .from(TABLES.TEACHERS)
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      return count || 45
    } catch (error) {
      return 45
    }
  }

  async getTotalCourses() {
    try {
      const { count, error } = await supabase
        .from(TABLES.COURSES)
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      return count || 32
    } catch (error) {
      return 32
    }
  }

  // 诗歌数据
  async getPoems(category = 'all', limit = null) {
    try {
      const poems = await mockDataService.getPoems()
      let filteredPoems = poems

      if (category !== 'all') {
        filteredPoems = poems.filter(p => p.category === category)
      }

      if (limit) {
        filteredPoems = filteredPoems.slice(0, limit)
      }

      return filteredPoems
    } catch (error) {
      console.error('获取诗歌数据失败:', error)
      return await mockDataService.getPoems()
    }
  }

  // 获取诗歌详情
  async getPoemDetails(poemId) {
    try {
      return await mockDataService.getPoem(poemId)
    } catch (error) {
      console.error('获取诗歌详情失败:', error)
      return null
    }
  }

  // 实时数据订阅
  subscribeToStudentProgress(studentId, callback) {
    return supabase
      .channel('student-progress')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: TABLES.LEARNING_ACTIVITIES,
          filter: `student_id=eq.${studentId}`
        },
        callback
      )
      .subscribe()
  }
}

export const dataService = new DataService()
export default dataService