import { createRouter, createWebHistory } from 'vue-router'
import PoetryView from '@/views/PoetryView.vue'

export const routes = [
  {
    path: '/',
    name: 'PoetryView',
    component: PoetryView,
    meta: { title: '诗词赏析' }
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


