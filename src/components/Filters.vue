<template>
    <div>
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            persistent
            transition="slide-y-transition"
            location="bottom"
        >
            <template #activator="{ props }">
                <v-btn
                    v-bind="props"
                    class="ma-4"
                    :color="filterBtnBackground"
                    style="float: right; color: white"
                >
                    Filters
                </v-btn>
            </template>

            <v-card rounded="lg" elevation="0" class="pt-4">
                <v-card-title class="d-flex align-center">
                    Filters                    
                    <v-spacer />

                    <v-card-subtitle class="pt-0">
                        Aggregate Start Date:
                        <strong>{{ startDate }}</strong>
                    </v-card-subtitle>
                </v-card-title>

                <v-row
                    align="center"
                    justify="center"
                >
                    <v-col
                        cols="12"
                        class="text-center"
                    >
                        <v-card-subtitle class="d-flex align-center flex-wrap">
                            Custom Date Range:

                            <v-checkbox
                                v-model="isTimePeriodDisabled"
                                class="pl-1"
                                density="compact"
                                hide-details
                            />

                            <template v-if="!isAnalytics">
                                Comparison:

                                <v-checkbox
                                    v-model="isComparisonEnabled"
                                    class="pl-1"
                                    density="compact"
                                    hide-details
                                />
                            </template>

                            <template v-if="!isAnalytics">
                                Customer Direct:

                                <v-checkbox
                                    v-model="isCustomerDirectEnabled"
                                    class="pl-1"
                                    density="compact"
                                    hide-details
                                />
                            </template>
                        </v-card-subtitle>
                    </v-col>
                </v-row>

                <v-row
                    class="pr-4 pl-4"
                    align="center"
                    justify="center"
                >
                    <v-col
                        cols="12"
                        class="text-center"
                    >
                        <v-date-picker
                            v-model="dates"
                            color="#FF6F00"
                            :disabled="!isTimePeriodDisabled"
                            :allowed-dates="allowedDates"
                            :min="minDate"
                            :max="maxDate"
                            width="500"
                            multiple="range"
                        />
                    </v-col>
                </v-row>

                <v-row class="pr-16 pl-16">
                    <v-col cols="12">
                        <v-slider
                            v-model="timePeriod"
                            :ticks="tickLabels"
                            :max="5"
                            :step="1"
                            show-ticks="always"
                            thumb-color="blue"
                            color="blue"
                            :disabled="isTimePeriodDisabled"
                            class="mx-n8"
                        />
                    </v-col>
                </v-row>

                <v-row
                    v-if="!isAnalytics"
                    class="pr-4 pl-4 mb-6"
                >
                    <v-col cols="12">
                        <v-text-field
                            v-model="volumeThreshold"
                            label="Volume Threshold"
                            type="number"
                            :rules="volumeThresholdValidation"
                            hide-details="auto"
                        />
                    </v-col>
                </v-row>

                <v-card-subtitle>
                    The equipment type filter is available in the lanes view
                    only.
                </v-card-subtitle>

                <v-row class="pr-4 pl-4">
                    <v-col cols="12">
                        <v-select
                            v-model="selectedEquipmentTypes"
                            :items="EQUIPMENT_TYPE_LIST"
                            label="Equipment Type"
                            multiple
                            style="padding-top: 16px"
                            :disabled="isLaneDrilldown && !isAnalytics"
                        />
                    </v-col>
                </v-row>

                <v-card-actions>
                    <v-spacer />

                    <v-btn
                        color="red"
                        variant="text"
                        size="large"
                        @click="menu = false"
                    >
                        Cancel
                    </v-btn>

                    <v-btn
                        color="green"
                        variant="text"
                        size="large"
                        @click="applyFilters"
                    >
                        Apply
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useTheme } from 'vuetify'

import { useAppStore } from '@/stores/appStore'

const props = defineProps({
    time_period: Number,
    updateData: Array,
    is_lane_drilldown: Boolean,
    volume_threshold: Number,
    is_analytics: Boolean
})

const emit = defineEmits(['applySelectedFilters'])

const appStore = useAppStore()
const theme = useTheme()

const menu = ref(false)

const isLaneDrilldown = ref(props.is_lane_drilldown)
const isAnalytics = ref(props.is_analytics)

const EQUIPMENT_TYPE_LIST = ref(appStore.equipment_type_list)

const selectedEquipmentTypes = ref([
    ...appStore.equipment_type_list
])

const timePeriod = ref(appStore.storeTimeSlider)

const tickLabels = {
    0: 'Last 7',
    1: 'Last 14',
    2: 'Last 30',
    3: 'Last 60',
    4: 'Last 90',
    5: 'All'
}

const tickValues = [7, 14, 30, 60, 90]

const dates = ref(null)

const minDate = `${new Date().getUTCFullYear() - 10}-01-01`
const maxDate = `${new Date().getUTCFullYear()}-12-31`

const volumeThreshold = ref(appStore.storeVolumeThreshold)

const volumeThresholdValidation = [
    value => value > -1 || 'Must input a positive number'
]

const startDate = computed(() =>
    new Date(appStore.startDate).toDateString()
)

const isTimePeriodDisabled = ref(
    appStore.storeIsTimePeriodDisabled
)

const isComparisonEnabled = ref(
    appStore.storeIsComparisonEnabled
)

const isCustomerDirectEnabled = ref(
    appStore.storeIsCustomerDirectEnabled
)

const filterBtnBackground = computed(() => {
    return theme.global.current.value.dark
        ? '#424242'
        : '#1976D2'
})

watch(
    () => props.updateData,
    val => {
        if (val?.[0]) {
            dates.value = val[0].dates
            timePeriod.value = val[0].timeSlider
            volumeThreshold.value = parseInt(val[0].volume)
            selectedEquipmentTypes.value = val[0].equipment
            isCustomerDirectEnabled.value =
                val[0].isCustomerDirectEnabled
        }

        isComparisonEnabled.value = val?.[1]
    },
    { deep: true }
)

const allowedDates = (dateSelected) => {
    const date = new Date(
        new Date(dateSelected).setHours(5, 0, 0)
    )

    const today = new Date(
        new Date().setHours(5, 0, 0)
    )

    const difference = (
        (today.getTime() - date.getTime()) /
        (24 * 60 * 60 * 1000)
    ).toFixed(0)

    return difference > 0
}

const applyFilters = () => {
    menu.value = false

    let finalPeriod = null
    let finalDate = new Date()

    if (!isTimePeriodDisabled.value) {
        dates.value = null

        if (timePeriod.value === 5) {
            const today = new Date(
                new Date().setHours(5, 0, 0)
            )

            const start = new Date(
                new Date(appStore.startDate).setHours(
                    5,
                    0,
                    0
                )
            )

            finalPeriod = (
                (today.getTime() - start.getTime()) /
                    (24 * 60 * 60 * 1000) +
                1
            ).toFixed(0)
        } else {
            finalPeriod = tickValues[timePeriod.value]
        }
    } else if (
        isTimePeriodDisabled.value &&
        dates.value?.length === 2
    ) {
        timePeriod.value = 5

        const d1 = dates.value[0].split('-')
        const d2 = dates.value[1].split('-')

        const firstSelected = new Date(
            new Date(d1[0], d1[1] - 1, d1[2]).setHours(
                5,
                0,
                0
            )
        )

        const secondSelected = new Date(
            new Date(d2[0], d2[1] - 1, d2[2]).setHours(
                5,
                0,
                0
            )
        )

        const date =
            firstSelected <= secondSelected
                ? secondSelected
                : firstSelected

        finalDate = new Date(
            new Date(date).setHours(5, 0, 0)
        )

        let diff = (
            (firstSelected.getTime() -
                secondSelected.getTime()) /
                (24 * 60 * 60 * 1000) +
            1
        ).toFixed(0)

        if (firstSelected < secondSelected) {
            diff = (
                (secondSelected.getTime() -
                    firstSelected.getTime()) /
                    (24 * 60 * 60 * 1000) +
                1
            ).toFixed(0)
        }

        finalPeriod = Math.abs(diff)

        appStore.storeDates = dates.value
    } else if (
        isTimePeriodDisabled.value &&
        dates.value?.length === 1
    ) {
        timePeriod.value = 5

        const d = dates.value[0].split('-')

        const firstSelected = new Date(
            new Date(d[0], d[1] - 1, d[2]).setHours(
                5,
                0,
                0
            )
        )

        finalDate = new Date(
            new Date(firstSelected).setHours(5, 0, 0)
        )

        finalPeriod = 1

        appStore.storeDates = dates.value
    }

    if (
        volumeThreshold.value < 0 ||
        volumeThreshold.value == null ||
        Number.isNaN(volumeThreshold.value) ||
        volumeThreshold.value === ''
    ) {
        volumeThreshold.value = 0
    }

    const filters = {
        dates: dates.value,
        timeSlider: timePeriod.value,
        volume: volumeThreshold.value,
        equipment: selectedEquipmentTypes.value,
        isCustomerDirectEnabled:
            isCustomerDirectEnabled.value
    }

    appStore.storeIsTimePeriodDisabled =
        isTimePeriodDisabled.value

    appStore.storeTimeSlider = timePeriod.value

    emit(
        'applySelectedFilters',
        finalDate,
        parseInt(finalPeriod) - 1,
        volumeThreshold.value,
        selectedEquipmentTypes.value,
        isComparisonEnabled.value,
        filters
    )
}
</script>

<style scoped>
.v-slider-thumb__label {
    font-size: 20px;
    font-weight: bold;
}
</style>