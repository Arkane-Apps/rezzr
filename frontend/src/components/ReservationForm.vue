<script setup>
import { ref } from 'vue';

const date = ref();
const flow = ref(['month', 'calendar', 'hours', 'minutes']);
</script>
<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import RezField from './forms/RezField.vue'

export default {
  components: {
    RezField,
    VueDatePicker
  },
  data() {
    return {
      errors: [],
    }
  },
  methods: {
    checkForm: function (e) {
      console.log(e);
    }
  }
}
</script>
<template>
  <form id="createRez" @submit="checkForm" action="https://vuejs.org/" method="post">
    <RezField rezFieldLabel="Name">
      <input class="input is-success" type="text" placeholder="Summer West">
    </RezField>

    <RezField rezFieldLabel="Email">
      <input class="input" type="email" placeholder="rezzr@rezzr.com">
    </RezField>

    <RezField rezFieldLabel="Party Size">
      <select>
        <option v-for="ind in 9" :key="ind">{{ ind }}</option>
        <option>10+</option>
      </select>
    </RezField>

    <RezField rezFieldLabel="Reservation Time">
      <VueDatePicker v-model="date" :flow="flow" minutes-increment="15" minutes-grid-increment="15" :is-24="false" />
    </RezField>

    <p>
      <input type="submit" value="Submit">
    </p>
  </form>
</template>
