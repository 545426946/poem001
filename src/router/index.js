import { createRouter, createWebHistory } from 'vue-router'
import PoetryView from '@/views/PoetryView.vue'
import Login from '@/views/Login.vue'
import StudentDashboard from '@/views/StudentDashboard.vue'
import TeacherDashboard from '@/views/TeacherDashboard.vue'
import CollegeDashboard from '@/views/CollegeDashboard.vue'

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: PoetryView,
    meta: { title: '诗词赏析' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/student',
    name: 'StudentDashboard',
    component: StudentDashboard,
    meta: { title: '学生工作台', requiresAuth: true }
  },
  {
    path: '/teacher',
    name: 'TeacherDashboard',
    component: TeacherDashboard,
    meta: { title: '教师管理台', requiresAuth: true }
  },
  {
    path: '/college',
    name: 'CollegeDashboard',
    component: CollegeDashboard,
    meta: { title: '学院数据大屏', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 认证检查
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 启明星诗歌平台`
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 延迟导入authStore以避免循环依赖
    import('@/stores/auth').then(({ useAuthStore }) => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        next('/login')
      } else {
        next()
      }
    })
  } else {
    next()
  }
})

export default router


