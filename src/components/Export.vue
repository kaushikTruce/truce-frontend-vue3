<template>
    This is Exports Page
</template>

<script setup>
console.log("Export Page")

const emit = defineEmits(['exportDialogState'])
emit('exportDialogState', false)

</script>

<style scoped>

</style>
