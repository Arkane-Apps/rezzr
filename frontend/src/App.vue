<script>
import ReservationNav from './components/ReservationNav.vue'

export default {
  data() {
    return {}
  },
  components: {
    ReservationNav
  },
}
</script>
<template>
  <div id="app-page" class="container">
    <ReservationNav />
    <div id="app-content" class="content">
      <router-view />
    </div>
  </div>
</template>
