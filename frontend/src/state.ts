import { reactive } from 'vue'

export const appState = reactive({
  showInventoryCreateModal: false,
  showReservationCreateModal: false,
  showNotification: false
})
