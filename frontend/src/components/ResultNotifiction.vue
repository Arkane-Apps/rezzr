<script>
import { appState } from '../state'

export default {
    data() {
        return {
            appState,
            props: ['notificationClass'],
        }
    },
    methods: {
        closeNotification() {
            appState.showNotification = false
        }
    }
}
</script>
<template>
    <div class="notification" :class="props.notificationClass" v-if="appState.showNotification">
        <button class="delete" @click="closeNotification"></button>
        <slot />
    </div>
</template>