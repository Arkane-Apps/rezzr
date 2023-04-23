<script>
import moment from 'moment';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { appState } from '../state'
import RezField from './forms/RezField.vue'

const fieldValues = {
  name: null,
  email: null,
  partySize: null,
  reservationTime: null,
}

const pickerFlow = ['month', 'calendar', 'hours', 'minutes']

export default {
  components: {
    RezField,
    VueDatePicker
  },
  data() {
    return {
      appState,
      pickerFlow,
      fieldValues
    }
  },
  methods: {
    closeModal: function () {
      appState.showReservationCreateModal = false
    },
    submitForm: async function (clickEvent, _fieldValues) {
      clickEvent.preventDefault();
      if (
        moment(_fieldValues.reservationTime).isValid() &&
        _fieldValues.partySize &&
        parseInt(_fieldValues.partySize) > 1 &&
        _fieldValues.name &&
        _fieldValues.email) {
        const reservationTimeString = moment(_fieldValues.reservationTime).format("YYYY-MM-DDTHH:mm:SS")
        const requestBody = {
          name: _fieldValues.name,
          email: _fieldValues.email,
          party_size: parseInt(_fieldValues.partySize),
          reservation_time: reservationTimeString,
        }
        try {
          const invReqOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
          };
          let fetchResult = await fetch('http://localhost:9090/api/reservations', invReqOptions)
          console.log(fetchResult)
        } catch (err) {
          console.log(err)
        }
      }
      window.location.reload();
    },
  }
}
</script>
<template>
  <div class="modal" :class="appState.showReservationCreateModal && 'is-active'">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="container has-background-white p-6 rounded">
        <h1>New Reservation</h1>
        <p>{{ fieldValues.reservationTime }}</p>
        <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
        <form id="createRes">
          <RezField rezFieldLabel="Name">
            <input class="input" type="text" placeholder="Summer West" v-model="fieldValues.name">
          </RezField>
          <div class="field">
            <label class="label">Email</label>
            <div class="control has-icons-left">
              <input class="input" type="email" placeholder="summer@rezzr.com" v-model="fieldValues.email">
              <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
          </div>

          <RezField rezFieldLabel="Party Size">
            <input class="input" type="text" placeholder="4" v-model="fieldValues.partySize">
          </RezField>

          <RezField rezFieldLabel="Reservation Time">
            <VueDatePicker auto-apply v-model="fieldValues.reservationTime" :flow="pickerFlow" minutes-increment="15"
              minutes-grid-increment="15" :is-24="false" />
          </RezField>

          <div class="control">
            <button class="button is-link" @click="submitForm($event, fieldValues)">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
