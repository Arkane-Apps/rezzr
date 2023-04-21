
<script>
export default {
    props: {
        rezFieldLabel: String,
    }
}
</script>
<template>
    <div class="field">
        <label class="label">{{ rezFieldLabel }}</label>
        <div class="control">
            <slot />
        </div>
    </div>
</template>