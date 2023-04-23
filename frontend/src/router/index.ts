import { createRouter, createWebHistory } from 'vue-router'
import Inventory from '../views/InventoryView.vue'
import Reservations from '../views/ReservationsView.vue'

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
      component: Inventory
    }
  ]
})

export default router
