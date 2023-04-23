<script>
import { reactive } from 'vue'

import moment from 'moment';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { appState } from '../state'
import RezField from './forms/RezField.vue'

const fieldState = reactive({
  dateValid: null, // VueDatepicker component uses null/true/false for appearance
  timesValid: "",
  slotsValid: ""
})

const fieldValues = {
  scheduleWindow: null,
  weekDays: {
    "Sunday": false,
    "Monday": false,
    "Tuesday": false,
    "Wednesday": false,
    "Thursday": false,
    "Friday": false,
    "Saturday": false
  },
  scheduleStart: 12,
  scheduleEnd: 20,
  maxPartyValue: null,
  slotsValue: null
}

const datesAreValid = (dateValue) => {
  return dateValue instanceof Array
}
const timesAreValid = (startTime, endTime) => {
  return parseInt(startTime) < parseInt(endTime)
}
const numbersAreValid = (slotValue) => {
  return slotValue && parseInt(slotValue) > 1
}



export default {
  components: {
    RezField,
    VueDatePicker
  },
  data() {
    return {
      appState,
      fieldState,
      fieldValues
    }
  },
  methods: {
    submitForm: async function (clickEvent, _fieldValues) {
      clickEvent.preventDefault();
      if (datesAreValid(_fieldValues.scheduleWindow) && timesAreValid(_fieldValues.scheduleStart, _fieldValues.scheduleEnd) && numbersAreValid(_fieldValues.slotsValue) && numbersAreValid(_fieldValues.maxPartyValue)) {
        const startDateString = moment(_fieldValues.scheduleWindow[0]).format('YYYY-MM-DD');
        const endDateString = moment(_fieldValues.scheduleWindow[1]).format('YYYY-MM-DD');
        const requestBody = {
          schedule_start: startDateString,
          schedule_end: endDateString,
          days: Object.values(_fieldValues.weekDays),
          party_size: _fieldValues.maxPartyValue,
          slots: _fieldValues.slotsValue,
          time_slot_start: _fieldValues.scheduleStart,
          time_slot_end: _fieldValues.scheduleEnd
        }
        try {
          const invReqOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
          };
          let fetchResult = await fetch('http://localhost:9090/api/inventory', invReqOptions)
          console.log(fetchResult)
        } catch (err) {
          console.log(err)
        }
      }
    },
    closeModal: function () {
      appState.showInventoryCreateModal = false
    },
    validateDate(dateValue) {
      if (datesAreValid(dateValue)) {
        fieldState.dateValid = true
      } else {
        fieldState.dateValid = false
      }
    },
    validateTimes(startTime, endTime) {
      if (timesAreValid(startTime, endTime)) {
        fieldState.timesValid = "is-success"
      } else {
        fieldState.timesValid = "is-danger"
      }
    },
    validateIntFields(slotValue) {
      if (numbersAreValid(slotValue)) {
        fieldState.slotsValid = "is-success"
      } else {
        fieldState.slotsValid = "is-danger"
      }
    },
  }
}
</script>
<template>
  <div class="modal" :class="appState.showInventoryCreateModal && 'is-active'">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="container has-background-white p-6 rounded">
        <h1>New Reservation Inventory</h1>
        <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
        <form id="createInv">
          <RezField rezFieldLabel="Schedule Window">
            <VueDatePicker v-model="fieldValues.scheduleWindow" range auto-apply :enable-time-picker="false"
              @closed="validateDate(fieldValues.scheduleWindow)" @cleared="validateDate(fieldValues.scheduleWindow)"
              :state="fieldState.dateValid" />
          </RezField>

          <RezField rezFieldLabel="Schedule Days">
            <div class="field is-grouped-multiline">
              <div class="control" v-for="(val, weekDay) of fieldValues.weekDays" :key="weekDay">
                <label class="checkbox">
                  <input type="checkbox" v-model="fieldValues.weekDays[weekDay]"> {{ weekDay }}
                </label>
              </div>
            </div>
          </RezField>

          <RezField rezFieldLabel="Schedule Hours">
            <div class="field is-grouped">
              <div class="select" :class="fieldState.timesValid">
                <select v-model="fieldValues.scheduleStart"
                  @change="validateTimes(fieldValues.scheduleStart, fieldValues.scheduleEnd)">
                  <option v-for="ind in 23" :key="ind - 1">{{ ind - 1 }}</option>
                </select>
              </div>
              <span class="icon">
                <i class="fas fa-arrow-right">-></i>
              </span>
              <div class="select" :class="fieldState.timesValid">
                <select v-model="fieldValues.scheduleEnd"
                  @change="validateTimes(fieldValues.scheduleStart, fieldValues.scheduleEnd)">
                  <option v-for="ind in 23" :key="ind">{{ ind }}</option>
                </select>
              </div>
            </div>
          </RezField>

          <RezField rezFieldLabel="Max Party Size">
            <input class="input" type="text" placeholder="6" v-model="fieldValues.maxPartyValue"
              :class="fieldState.slotsValid" @change="validateIntFields(fieldValues.maxPartyValue)">
          </RezField>

          <RezField rezFieldLabel="Reservation slots per 15 minutes">
            <input class="input" type="text" placeholder="5" v-model="fieldValues.slotsValue"
              :class="fieldState.slotsValid" @change="validateIntFields(fieldValues.slotsValue)">
          </RezField>
          <div class="control">
            <button class="button is-link" @click="submitForm($event, fieldValues)">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
