<template>
    <v-tooltip location="top" max-width="25%">
        <template #activator="{ props }">
            <span v-bind="props">{{ headerText }}</span>
        </template>
        <span>{{ headerTool }}</span>
    </v-tooltip>
</template>

<script setup>

defineProps({
    headerText: {
        type: String,
        default: '',
    },
    headerTool: {
        type: String,
        default: '',
    }
})


</script>

<style scoped></style>
