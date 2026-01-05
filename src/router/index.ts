import { createRouter, createWebHistory } from 'vue-router'
import Game from '../components/Game.vue'
import InheritedTernary from '../components/InheritedTernary.vue'

const routes = [
  {
    path: '/',
    name: 'Game',
    component: Game
  },
  {
    path: '/converter',
    name: 'InheritedTernary',
    component: InheritedTernary
  }
]

const router = createRouter({
  history: createWebHistory('/OM-idle/'),
  routes
})

export default router
