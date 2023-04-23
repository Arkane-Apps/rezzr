<script>
import axios from 'axios'
import { reactive } from 'vue'

import ReservationForm from '../components/ReservationForm.vue'

const formStore = reactive({
  showCreateForm: false
})

export default {
  name: 'Reservation-View',
  components: {
    ReservationForm,
  },
  async mounted() {
    try {
      await axios.get('http://localhost:9090/api/reservations', {
        withCredentials: false
      })
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    showForm() {
      formStore.showCreateForm = !formStore.showCreateForm
    }
  },
  data() {
    return {
      formStore
    }
  }
}
</script>

<template>
  <h1>Reservations</h1>
  <button @click="showForm">Create Reservation: {{ formStore.showCreateForm }}</button>
  <ReservationForm v-if="formStore.showCreateForm" />
</template>
