import { 
  poemsLibrary, 
  poetryByDynasty, 
  poetryByDifficulty, 
  poetryByCategory,
  getRandomPoems,
  searchPoems,
  getPoemsByAuthor,
  getRecommendedPoems,
  getPopularPoems,
  getPoemsStats
} from '../data/poemsLibrary.js';

// 模拟数据服务 - 提供完整的数据结构
class MockDataService {
  constructor() {
    this.initializeData()
  }

  initializeData() {
    // 教师数据
    this.teachers = [
      {
        id: 'T2023001',
        name: '李明',
        gender: 'male',
        phone: '13800138001',
        email: 'liming@school.edu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1',
        department: '语文教研组',
        title: '高级教师',
        hireDate: '2020-09-01',
        status: 'active'
      },
      {
        id: 'T2023002',
        name: '王芳',
        gender: 'female',
        phone: '13800138002',
        email: 'wangfang@school.edu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2',
        department: '语文教研组',
        title: '一级教师',
        hireDate: '2021-09-01',
        status: 'active'
      },
      {
        id: 'T2023003',
        name: '张伟',
        gender: 'male',
        phone: '13800138003',
        email: 'zhangwei@school.edu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher3',
        department: '语文教研组',
        title: '高级教师',
        hireDate: '2019-09-01',
        status: 'active'
      },
      {
        id: 'T2023004',
        name: '刘丽',
        gender: 'female',
        phone: '13800138004',
        email: 'liuli@school.edu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher4',
        department: '语文教研组',
        title: '一级教师',
        hireDate: '2022-09-01',
        status: 'active'
      },
      {
        id: 'T2023005',
        name: '陈强',
        gender: 'male',
        phone: '13800138005',
        email: 'chenqiang@school.edu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher5',
        department: '语文教研组',
        title: '特级教师',
        hireDate: '2018-09-01',
        status: 'active'
      }
    ]

    // 班级数据
    this.classes = [
      {
        id: 1,
        name: '高一(1)班',
        gradeLevel: 1,
        classNumber: 1,
        teacherId: 'T2023001',
        maxStudents: 50,
        academicYear: '2023-2024',
        status: 'active',
        avgProgress: 78,
        highRiskStudents: 3,
        totalStudents: 45
      },
      {
        id: 2,
        name: '高一(2)班',
        gradeLevel: 1,
        classNumber: 2,
        teacherId: 'T2023002',
        maxStudents: 50,
        academicYear: '2023-2024',
        status: 'active',
        avgProgress: 72,
        highRiskStudents: 5,
        totalStudents: 48
      },
      {
        id: 3,
        name: '高一(3)班',
        gradeLevel: 1,
        classNumber: 3,
        teacherId: 'T2023003',
        maxStudents: 50,
        academicYear: '2023-2024',
        status: 'active',
        avgProgress: 65,
        highRiskStudents: 7,
        totalStudents: 46
      },
      {
        id: 4,
        name: '高一(4)班',
        gradeLevel: 1,
        classNumber: 4,
        teacherId: 'T2023004',
        maxStudents: 50,
        academicYear: '2023-2024',
        status: 'active',
        avgProgress: 80,
        highRiskStudents: 2,
        totalStudents: 47
      },
      {
        id: 5,
        name: '高二(1)班',
        gradeLevel: 2,
        classNumber: 1,
        teacherId: 'T2023005',
        maxStudents: 50,
        academicYear: '2023-2024',
        status: 'active',
        avgProgress: 85,
        highRiskStudents: 1,
        totalStudents: 44
      }
    ]

    // 学生数据
    this.students = this.generateStudents()

    // 诗歌数据 - 使用丰富的诗歌库
    this.poems = poemsLibrary.map(poem => ({
      ...poem,
      // 添加学习统计数据
      studyCount: Math.floor(Math.random() * 2000) + 500,
      likeCount: Math.floor(Math.random() * 1000) + 200,
      viewCount: Math.floor(Math.random() * 5000) + 1000,
      status: 'active',
      // 转换难度格式
      difficulty: poem.difficulty === '初级' ? 'beginner' : 
                  poem.difficulty === '中级' ? 'intermediate' : 'advanced',
      // 添加标签
      tags: poem.keywords || [],
      backgroundInfo: poem.background,
      literaryDevices: ['比喻', '对偶', '夸张', '象征', '拟人'][Math.floor(Math.random() * 5)],
      themes: poem.keywords?.slice(0, 2) || ['经典'],
      annotation: `${poem.title}的注释说明...`
    }))

    // 学习进度数据
    this.learningProgress = this.generateLearningProgress()
  }

  generateStudents() {
    const students = []
    const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗']
    const secondNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰', '霞', '平']
    
    let studentId = 1
    
    this.classes.forEach(classInfo => {
      for (let i = 0; i < classInfo.totalStudents; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const secondName = secondNames[Math.floor(Math.random() * secondNames.length)]
        const name = firstName + secondName
        
        students.push({
          id: `S2023${String(studentId).padStart(3, '0')}`,
          name: name,
          gender: Math.random() > 0.5 ? 'male' : 'female',
          phone: `139${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
          email: `${name.toLowerCase()}@student.edu`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=student${studentId}`,
          classId: classInfo.id,
          enrollmentDate: '2023-09-01',
          status: 'active',
          progress: Math.floor(Math.random() * 100),
          studiedPoems: Math.floor(Math.random() * 20),
          avgScore: Math.floor(Math.random() * 40) + 60,
          currentStreak: Math.floor(Math.random() * 30)
        })
        studentId++
      }
    })
    
    return students
  }

  generateLearningProgress() {
    const progress = []
    
    this.students.forEach(student => {
      this.poems.forEach(poem => {
        if (Math.random() > 0.3) { // 70%的学生学习了这首诗
          progress.push({
            id: `${student.id}_${poem.id}`,
            studentId: student.id,
            poemId: poem.id,
            overallProgress: Math.floor(Math.random() * 100),
            readProgress: Math.floor(Math.random() * 100),
            analyzeProgress: Math.floor(Math.random() * 100),
            reciteProgress: Math.floor(Math.random() * 100),
            quizScore: Math.floor(Math.random() * 40) + 60,
            bestScore: Math.floor(Math.random() * 40) + 60,
            attemptCount: Math.floor(Math.random() * 10) + 1,
            masteryLevel: ['not_started', 'learning', 'practiced', 'mastered'][Math.floor(Math.random() * 4)],
            lastStudyAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          })
        }
      })
    })
    
    return progress
  }

  // API方法
  async getTeachers() {
    return this.teachers
  }

  async getTeacher(id) {
    return this.teachers.find(t => t.id === id)
  }

  async getClasses() {
    return this.classes.map(classInfo => ({
      ...classInfo,
      teacher: this.teachers.find(t => t.id === classInfo.teacherId),
      students: this.students.filter(s => s.classId === classInfo.id)
    }))
  }

  async getClass(id) {
    const classInfo = this.classes.find(c => c.id === parseInt(id))
    if (!classInfo) return null

    const teacher = this.teachers.find(t => t.id === classInfo.teacherId)
    const students = this.students.filter(s => s.classId === classInfo.id)
    
    return {
      ...classInfo,
      teacher,
      students
    }
  }

  async getClassesByTeacher(teacherId) {
    return this.classes
      .filter(c => c.teacherId === teacherId)
      .map(classInfo => ({
        ...classInfo,
        teacher: this.teachers.find(t => t.id === classInfo.teacherId),
        students: this.students.filter(s => s.classId === classInfo.id)
      }))
  }

  async getStudents() {
    return this.students.map(student => ({
      ...student,
      class: this.classes.find(c => c.id === student.classId)
    }))
  }

  async getStudent(id) {
    const student = this.students.find(s => s.id === id)
    if (!student) return null

    const classInfo = this.classes.find(c => c.id === student.classId)
    const progress = this.learningProgress.filter(p => p.studentId === id)
    
    return {
      ...student,
      class: classInfo,
      learningProgress: progress
    }
  }

  async getStudentsByClass(classId) {
    return this.students
      .filter(s => s.classId === parseInt(classId))
      .map(student => {
        const progress = this.learningProgress.filter(p => p.studentId === student.id)
        return {
          ...student,
          learningProgress: progress,
          avgProgress: progress.length > 0 ? 
            progress.reduce((sum, p) => sum + p.overallProgress, 0) / progress.length : 0
        }
      })
  }

  async getPoems() {
    return this.poems
  }

  async getPoem(id) {
    const poem = this.poems.find(p => p.id === parseInt(id))
    if (!poem) return null
    
    return {
      ...poem,
      // 确保赏析内容直接显示
      showAppreciation: true
    }
  }

  async getLearningProgress(studentId, poemId = null) {
    if (poemId) {
      return this.learningProgress.find(p => p.studentId === studentId && p.poemId === parseInt(poemId))
    }
    return this.learningProgress.filter(p => p.studentId === studentId)
  }

  async getCollegeOverview() {
    const totalStudents = this.students.length
    const totalTeachers = this.teachers.length
    const activeClasses = this.classes.filter(c => c.status === 'active').length
    const avgCompletion = Math.round(
      this.classes.reduce((sum, c) => sum + c.avgProgress, 0) / this.classes.length
    )
    const highRiskStudents = this.classes.reduce((sum, c) => sum + c.highRiskStudents, 0)
    const totalPoemsStudied = this.learningProgress.length

    return {
      totalStudents,
      totalTeachers,
      activeClasses,
      avgCompletion,
      highRiskStudents,
      totalPoemsStudied
    }
  }

  async getHighRiskStudents() {
    return this.students
      .filter(s => s.progress < 30)
      .map(student => ({
        ...student,
        class: this.classes.find(c => c.id === student.classId)
      }))
      .slice(0, 10)
  }

  async getPopularPoems() {
    return this.poems
      .sort((a, b) => b.studyCount - a.studyCount)
      .slice(0, 10)
  }

  async getTeacherStats() {
    return this.teachers.map(teacher => {
      const teacherClasses = this.classes.filter(c => c.teacherId === teacher.id)
      const avgProgress = teacherClasses.length > 0 ?
        Math.round(teacherClasses.reduce((sum, c) => sum + c.avgProgress, 0) / teacherClasses.length) : 0
      
      return {
        ...teacher,
        classes: teacherClasses.length,
        avgProgress
      }
    })
  }

  // 新增方法 - 用户档案
  async getUserProfile(userId) {
    // 根据ID判断是学生还是教师
    if (userId.startsWith('S')) {
      return this.getStudent(userId)
    } else if (userId.startsWith('T')) {
      return this.getTeacher(userId)
    }
    return null
  }

  // 新增方法 - 教师档案
  async getTeacherProfile(teacherId) {
    return this.getTeacher(teacherId)
  }

  // 新增方法 - 学习进度
  async getLearningProgress(studentId) {
    return this.learningProgress.filter(p => p.studentId === studentId)
  }

  // 新增方法 - 分析数据
  async getAnalyticsData(type, filters = {}) {
    switch (type) {
      case 'college_overview':
        return this.getCollegeOverview()
      case 'teacher_stats':
        return this.getTeacherStats()
      case 'student_progress':
        const student = await this.getStudent(filters.studentId)
        return student ? student.learningProgress : []
      default:
        throw new Error(`未知的分析类型: ${type}`)
    }
  }

  // 新增方法 - 知识搜索
  async searchKnowledge(query, options = {}) {
    // 简单的关键词搜索
    const results = this.poems.filter(poem => 
      poem.title.includes(query) || 
      poem.author.includes(query) ||
      poem.content.includes(query) ||
      (poem.keywords && poem.keywords.some(keyword => keyword.includes(query)))
    )
    
    return results.slice(0, options.limit || 5)
  }
}

export const mockDataService = new MockDataService()
export default mockDataService