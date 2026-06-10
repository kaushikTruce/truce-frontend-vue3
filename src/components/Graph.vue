<template>
    <div style="width: 100%">
        <apexchart
            :ref="chartRef"
            :height="height"
            :type="type"
            :options="options"
            :series="series"
        />
    </div>
</template>

<script setup>
import {
    computed,
    nextTick,
    reactive,
    ref,
    watch
} from 'vue'

import { useTheme } from 'vuetify'

import _ from 'lodash'

import * as format from '../formatShipmentData'
import * as utils from '../utils'

import getConfig from '../configs/graphConfig'

const props = defineProps({
    rawData: {
        type: Array,
        default: () => []
    },

    graphName: {
        type: String,
        required: true
    },

    timeRange: {
        type: Number,
        default: 0
    },

    isBroker: {
        type: Boolean,
        default: false
    }
})

const theme = useTheme()

const chartRef = ref(null)

const series = ref([])

const toggled = ref([])

const dayCategories = ref([])

const dayCategoriesFull = ref([])

const allCategoriesAbbv = [
    'Sun',
    'Mon',
    'Tues',
    'Wed',
    'Thurs',
    'Fri',
    'Sat'
]

const allCategoriesFull = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

function getGraphTooltipDate(value) {
    const options = {
        month: 'short',
        day: 'numeric'
    }

    const dayMs = 1000 * 60 * 60 * 24

    const weekDate = new Date(
        value + dayMs
    ).toLocaleDateString('en-us', options)

    if (props.timeRange > utils.DEFAULT_DAYS) {
        const weekOffsetDate = new Date(
            value + 7 * dayMs
        ).toLocaleDateString('en-us', options)

        return `${weekDate} - ${weekOffsetDate}`
    }

    return weekDate
}

const graphContext = reactive({
    get isDark() {
        return theme.global.current.value.dark
    },

    get graphBackground() {
        return theme.global.current.value.colors
            .graphBackground
    },

    getGraphTooltipDate,

    get toggled() {
        return toggled.value
    },

    get series() {
        return series.value
    },

    get chartRef() {
        return chartRef.value
    },

    get graphName() {
        return props.graphName
    },

    get dayCategories() {
        return dayCategories.value
    },

    get dayCategoriesFull() {
        return dayCategoriesFull.value
    }
})

const config = ref(
    getConfig(
        props.graphName,
        graphContext
    )
)

const type = computed(() => config.value.type)

const height = computed(() => {
    return config.value?.height ?? 220
})

const options = ref(
    _.cloneDeep(config.value.graphOptions)
)

watch(
    () => props.graphName,
    val => {
        config.value = getConfig(
            val,
            graphContext
        )

        options.value = _.cloneDeep(
            config.value.graphOptions
        )

        updateGraph()
    }
)

watch(
    () => props.rawData,
    () => {
        updateGraph()
    },
    {
        deep: true,
        immediate: true
    }
)

watch(
    () => theme.global.current.value.dark,
    () => {
        const mergedOptions = deepMerge(
            _.cloneDeep(options.value),
            {
                chart: {
                    foreColor:
                        graphContext.isDark
                            ? '#E1E1E1'
                            : '#000000',

                    background:
                        graphContext.graphBackground
                },

                theme: {
                    mode: graphContext.isDark
                        ? 'dark'
                        : 'light'
                }
            }
        )

        updateOptions(mergedOptions)
    }
)

async function updateOptions(newOptions) {
    options.value = _.cloneDeep(newOptions)

    await nextTick()

    if (chartRef.value?.chart) {
        chartRef.value.chart.updateOptions(
            _.cloneDeep(newOptions)
        )
    }
}

function updateGraph() {
    series.value = []

    const optionAdd = {}

    if (
        type.value === 'bar' &&
        props.rawData != null
    ) {
        const eligibleDays = props.rawData.flatMap(
            item => item.day_of_week
        )

        dayCategories.value =
            allCategoriesAbbv.filter(
                (_, index) =>
                    eligibleDays.includes(index + 1)
            )

        dayCategoriesFull.value =
            allCategoriesFull.filter(
                (_, index) =>
                    eligibleDays.includes(index + 1)
            )
    }

    for (const [name, val] of Object.entries(
        config.value.toDraw
    )) {
        extractData(
            name,
            val.decimals,
            val?.dataName,
            config.value?.customReader
        )

        if (val.options) {
            extractOptions(
                val.options,
                optionAdd
            )
        }
    }

    const merged = deepMerge(
        _.cloneDeep(config.value.graphOptions),
        optionAdd
    )

    updateOptions(merged)
}

function extractOptions(object, optionDrill) {
    Object.keys(object).forEach(key => {
        const item = object[key]

        if (Array.isArray(optionDrill[key])) {
            optionDrill[key].push(item)
        } else if (
            typeof item === 'object' &&
            item !== null
        ) {
            if (optionDrill[key] === undefined) {
                optionDrill[key] = {}
            }

            extractOptions(
                item,
                optionDrill[key]
            )
        } else if (
            optionDrill[key] === undefined
        ) {
            optionDrill[key] = [item]
        }
    })
}

function deepMerge(target, source) {
    const output = _.cloneDeep(target)

    Object.keys(source).forEach(key => {
        if (
            typeof source[key] !== 'object' ||
            source[key] === null ||
            Array.isArray(source[key])
        ) {
            output[key] = source[key]
        } else {
            output[key] = deepMerge(
                output[key] || {},
                source[key]
            )
        }
    })

    return output
}

function extractData(
    name,
    avgDecimal = 0,
    nameOverride,
    readOverride
) {
    const data = props.rawData

    const dataType = type.value

    const nameVal = nameOverride
        ? nameOverride
        : name.toLowerCase()

    const shaped = []

    if (readOverride) {
        readOverride(data, nameVal, name)
        return
    }

    if (
        ['average', 'avg'].includes(
            name.toLowerCase()
        )
    ) {
        const average = format.formatDecimal(
            data?.[0]?.[nameVal],
            avgDecimal
        )

        data.forEach(element => {
            shaped.push({
                x: element.week,
                y: average
            })
        })

        shaped.sort((a, b) =>
            a.x > b.x ? 1 : -1
        )
    } else if (
        data != null &&
        data[0] != undefined &&
        nameVal in data[0]
    ) {
        if (
            dataType === 'line' ||
            dataType === 'area'
        ) {
            data.forEach(element => {
                shaped.push({
                    x: element.week,
                    y: parseFloat(
                        element[nameVal]
                    )
                })
            })

            shaped.sort((a, b) =>
                a.x > b.x ? 1 : -1
            )
        } else if (dataType === 'bar') {
            data.forEach(element => {
                shaped.push(
                    element[nameVal]
                )
            })
        }
    } else {
        console.log('Invalid graph type')
        return
    }

    series.value.push({
        name,
        data: shaped
    })
}
</script>