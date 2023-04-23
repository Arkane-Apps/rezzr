<script>
import { reactive } from 'vue'

import { appState } from '../state'
import ReservationModal from '../components/ReservationModal.vue'

const pageState = reactive({
  reservations: []
})

export default {
  name: 'Reservation-View',
  components: {
    ReservationModal,
  },
  async mounted() {
    try {
      let resResp = await fetch('http://localhost:9090/api/reservations')
      pageState.reservations = await resResp.json()
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    openModal() {
      appState.showReservationCreateModal = true;
    }
  },
  data() {
    return {
      pageState
    }
  }
}
</script>

<template>
  <h1>Reservations</h1>
  <button class="button is-primary" @click="openModal" data-target="create-res-modal">
    Create Reservation
  </button>
  <table class="table">
    <thead>
      <tr>
        <th v-for="(resVal, resKey) in pageState.reservations[0]" :key="resKey">{{ resKey }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="resEntry in pageState.reservations" :key="resEntry.id">
        <td v-for="(resVal, resKey) in resEntry" :key="resKey">{{ resVal }}</td>
      </tr>
    </tbody>
  </table>
  <ReservationModal />
</template>
