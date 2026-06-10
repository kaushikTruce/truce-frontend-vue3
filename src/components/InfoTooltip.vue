<template>
    <v-menu location="top">
        <template #activator="{props}">
            <v-btn v-bind="props" icon size="x-small" variant="text">
                <v-icon color="grey-lighten-1">
                    mdi-information-variant-circle-outline
                </v-icon>
            </v-btn>
        </template>

        <v-card elevation="0" class="tooltip-card">
            <v-card-subtitle class="pa-2 text-white">
                {{ tooltipText }}
            </v-card-subtitle>
        </v-card>
    </v-menu>


</template>

<script setup>

defineProps({
    tooltipText: {
        type: String,
        default: '',
    }
})

</script>

<style scoped>
.tooltip-card {
    background-color: #5d5b5be6 !important;
}

</style>
