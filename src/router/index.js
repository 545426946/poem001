import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
const Login = () => import('@/views/Login.vue')
const StudentDashboard = () => import('@/views/StudentDashboard.vue')
const TeacherDashboard = () => import('@/views/TeacherDashboard.vue')
const CollegeDashboard = () => import('@/views/CollegeDashboard.vue')

export const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { title: '登录 - 启明星诗歌赏析平台' }
  },
  {
    path: '/student',
    name: 'StudentDashboard',
    component: StudentDashboard,
    meta: { title: '学生工作台 - 启明星', requiresAuth: true, role: 'student' }
  },
  {
    path: '/teacher',
    name: 'TeacherDashboard',
    component: TeacherDashboard,
    meta: { title: '教师管理台 - 启明星', requiresAuth: true, role: 'teacher' }
  },
  {
    path: '/college',
    name: 'CollegeDashboard',
    component: CollegeDashboard,
    meta: { title: '学院大屏 - 启明星', requiresAuth: true, role: 'college' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})