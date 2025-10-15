import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Poems from '@/views/Poems.vue'
import Poets from '@/views/Poets.vue'
import Appreciation from '@/views/Appreciation.vue'
import About from '@/views/About.vue'

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '古韵诗香 - 诗词赏析平台' }
  },
  {
    path: '/poems',
    name: 'Poems',
    component: Poems,
    meta: { title: '诗词库 - 古韵诗香' }
  },
  {
    path: '/poets',
    name: 'Poets',
    component: Poets,
    meta: { title: '诗人名录 - 古韵诗香' }
  },
  {
    path: '/appreciation',
    name: 'Appreciation',
    component: Appreciation,
    meta: { title: '诗词赏析 - 古韵诗香' }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: '关于我们 - 古韵诗香' }
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

// 路由守卫 - 页面标题设置
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router


