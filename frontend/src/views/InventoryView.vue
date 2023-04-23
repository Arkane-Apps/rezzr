
<script>
import { reactive } from 'vue'

import { appState } from '../state'
import InventoryModal from '../components/InventoryModal.vue'

const pageState = reactive({
  inventory: []
})

export default {
  methods: {
    openModal() {
      appState.showInventoryCreateModal = true;
    }
  },
  components: {
    InventoryModal
  },
  data() {
    return {
      appState,
      pageState
    }
  },
  async mounted() {
    try {
      let invResp = await fetch('http://localhost:9090/api/inventory')
      pageState.inventory = await invResp.json()
    } catch (error) {
      console.error(error)
    }
  },
}
</script>
<template>
  <div class="container">
    <h1>Inventory</h1>
    <button class="button is-primary" @click="openModal" data-target="create-inv-modal">
      Create Inventory Entry
    </button>
    <table class="table">
      <thead>
        <tr>
          <th v-for="(invVal, invKey) in pageState.inventory[0]" :key="invKey">{{ invKey }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="invEntry in pageState.inventory" :key="invEntry.id">
          <td v-for="(invVal, invKey) in invEntry" :key="invKey">{{ invVal }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <InventoryModal />
</template>
