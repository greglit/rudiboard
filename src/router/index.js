import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/board/:boardName/:boardId',
    component: () => import(/* webpackChunkName: "board" */ '../views/Board.vue')
  },
  {
    path: '/player/:boardName/:boardId/:playerName',
    component: () => import(/* webpackChunkName: "player" */ '../views/Player.vue')
  },
  {
    name: 'invite',
    path: '/invite/:boardName/:boardId/',
    component: () => import(/* webpackChunkName: "invitation" */ '../views/Invitation.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
