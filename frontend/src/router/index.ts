import { createRouter, createWebHistory } from 'vue-router'
import Reservations from '../views/Reservations.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: 'reservations'
    },
    {
      path: '/reservations',
      name: 'Reservations',
      component: Reservations
    },
    {
      path: '/inventory',
      name: 'Inventory',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ '../views/Inventory.vue')
    }
  ]
})

export default router
