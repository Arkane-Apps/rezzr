<template>
  <div>
    <h1>Reservations</h1>
    <button @click="showForm">Create Reservation: {{ formStore.showCreateForm }}</button>
  </div>
</template>

<script>
import axios from 'axios'
import { reactive } from 'vue'

const formStore = reactive({
  showCreateForm: false
})

export default {
  name: 'Reservations',
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
    showForm(event) {
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
