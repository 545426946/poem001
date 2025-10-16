import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Poems from '../views/Poems.vue'
import Poets from '../views/Poets.vue'
import PoetryView from '../views/PoetryView.vue'
import Appreciation from '../views/Appreciation.vue'
import DatabaseAdmin from '../views/DatabaseAdmin.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/poems',
    name: 'Poems',
    component: Poems
  },
  {
    path: '/poets',
    name: 'Poets',
    component: Poets
  },
  {
    path: '/poetry/:id',
    name: 'PoetryView',
    component: PoetryView,
    props: true
  },
  {
    path: '/appreciation',
    name: 'AppreciationList',
    component: Appreciation
  },
  {
    path: '/appreciation/:id',
    name: 'AppreciationDetail',
    component: Appreciation,
    props: true
  },
  {
    path: '/admin/database',
    name: 'DatabaseAdmin',
    component: DatabaseAdmin,
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 检查管理员权限
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    // 这里可以添加管理员权限检查逻辑
    const isAdmin = true // 临时设置为true，实际应该检查用户角色
    if (isAdmin) {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router