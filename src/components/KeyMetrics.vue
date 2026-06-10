<template>
    <v-card
        elevation="5"
        class="d-flex flex-column"
        style="height: 100%"
    >
        <v-card-title
            class="font-weight-light"
            style="margin-bottom: 10px; overflow-y: hidden; white-space: nowrap"
        >
            Key Metrics

            <v-spacer />

            <v-row class="font-weight-light text-body-2">
                <v-col cols="12">
                    <v-row ref="oldDateRange" dense>
                        <v-spacer />

                        <!-- Aggregation Tabs -->
                        <template v-if="showAggTabs && tabIndex !== 2">
                            <v-tabs
                                v-model="keyMetricsToggleLocal"
                                color="#0091ff"
                                class="selectorDateTabs"
                                style="width: 100%"
                            >
                                <v-tab
                                    :disabled="queryInProgress"
                                    :value="0"
                                >
                                    14D
                                </v-tab>

                                <v-divider vertical inset />

                                <v-tab
                                    :disabled="queryInProgress"
                                    :value="1"
                                >
                                    30D
                                </v-tab>

                                <v-divider vertical inset />

                                <v-tab
                                    :disabled="queryInProgress"
                                    :value="2"
                                >
                                    60D
                                </v-tab>
                            </v-tabs>
                        </template>

                        <!-- Projection Dates -->
                        <template v-else-if="tabIndex === 2">
                            <span
                                style="padding-top: 14px; padding-bottom: 14px"
                            >
                                {{ 'Projection Period: ' + getProjectionDates() }}
                            </span>
                        </template>

                        <!-- Normal Dates -->
                        <template v-else>
                            <template
                                v-if="!isPeriodNull && isComparisonEnabled"
                            >
                                {{ oldPeriodDates }} vs.
                            </template>

                            {{ periodDates }}
                        </template>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-title>

        <!-- Tab Content -->
        <v-window v-model="tabIndex">
            <v-window-item
                v-for="item in tabItems"
                :key="item.tab"
            >
                <v-card flat class="pt-0 pb-4">
                    <v-card-actions class="pa-0">
                        <v-container
                            v-if="!(tabIndex === 2 && projectionPeriod < 15)"
                        >
                            <!-- Shipper Dashboard -->
                            <v-row v-if="isShipperDashboard">
                                <v-col
                                    v-for="(metric, i) in filterMetrics(keyMetrics)"
                                    :key="i"
                                    cols="12"
                                    md="4"
                                    class="justify-center"
                                >
                                    <v-col>
                                        <v-row
                                            class="justify-center metric-value"
                                        >
                                            {{ metric.value }}

                                            <v-icon
                                                :color="getMetricColor(metric.color)"
                                            >
                                                {{ metric.icon }}
                                            </v-icon>

                                            <span
                                                class="caption font-italic font-weight-light"
                                            >
                                                {{ metric.change }}
                                            </span>
                                        </v-row>

                                        <v-row
                                            class="justify-center font-weight-light"
                                        >
                                            {{ metric.title }}
                                        </v-row>
                                    </v-col>
                                </v-col>
                            </v-row>

                            <!-- Non Shipper Dashboard -->
                            <v-row v-else>
                                <v-col
                                    v-for="(metric, i) in filterMetrics(keyMetrics)"
                                    :key="i"
                                    cols="12"
                                    md="2"
                                    class="justify-center"
                                >
                                    <v-col>
                                        <v-row
                                            class="justify-center metric-value"
                                        >
                                            {{ metric.value }}

                                            <v-icon
                                                :color="getMetricColor(metric.color)"
                                            >
                                                {{ metric.icon }}
                                            </v-icon>

                                            <span
                                                class="caption font-italic font-weight-light"
                                            >
                                                {{ metric.change }}
                                            </span>
                                        </v-row>

                                        <v-row
                                            class="justify-center font-weight-light"
                                        >
                                            {{ metric.title }}
                                        </v-row>
                                    </v-col>
                                </v-col>
                            </v-row>
                        </v-container>

                        <!-- Not Enough Projection Data -->
                        <v-container v-else>
                            <v-row
                                class="justify-center align-center text-subtitle-1 font-weight-light"
                                style="height: 10rem"
                            >
                                Not enough data to project.
                            </v-row>
                        </v-container>
                    </v-card-actions>
                </v-card>
            </v-window-item>
        </v-window>

        <v-spacer />

        <!-- Bottom Tabs -->
        <v-card-actions id="kmTabStyle" class="ma-0 pa-0">
            <v-tabs
                v-model="tabIndex"
                color="blue"
                grow
                id="kmtabs"
            >
                <v-tab
                    value="0"
                    class="moneyTab text-body-1 text-capitalize"
                    selected-class="moneyTabActive"
                >
                    Financials

                    <v-icon class="pl-1">
                        mdi-currency-usd
                    </v-icon>
                </v-tab>

                <v-tab
                    value="1"
                    class="performanceTab text-body-1 text-capitalize"
                    selected-class="performanceTabActive"
                >
                    Performance

                    <v-icon class="pl-1">
                        mdi-poll
                    </v-icon>
                </v-tab>

                <v-tab
                    value="2"
                    class="projectionTab text-body-1 text-capitalize"
                    selected-class="projectionTabActive"
                >
                    Projections

                    <v-icon class="pl-1">
                        mdi-trending-up
                    </v-icon>
                </v-tab>
            </v-tabs>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useTheme } from 'vuetify';

import * as utils from '../utils';
import { useAppStore } from '../stores/appStore';

const appStore = useAppStore();

const props = defineProps({
    is_loading: Boolean,
    key_metrics: {
        type: Array,
        default: () => []
    },
    is_dashboard_km: Boolean,
    show_agg_tabs: Boolean,
    is_period_null: Boolean,
    is_comparison_enabled: Boolean,
    query_in_progress: Boolean,
    key_metrics_toggle: Number,
    old_period_dates: String,
    period_dates: String
});

const emit = defineEmits(['periodTabChange']);

const theme = useTheme();

const tabIndex = ref(0);

const keyMetricsToggleLocal = ref(props.key_metrics_toggle ?? 0);

watch(keyMetricsToggleLocal, (val) => {
    emit('periodTabChange', val);
});

watch(
    () => props.key_metrics_toggle,
    (val) => {
        keyMetricsToggleLocal.value = val;
    }
);

const isLoading = computed(() => props.is_loading);

const keyMetrics = computed(() => props.key_metrics);

const isShipperDashboard = computed(() => props.is_dashboard_km);

const showAggTabs = computed(() => props.show_agg_tabs);

const isPeriodNull = computed(() => props.is_period_null);

const isComparisonEnabled = computed(
    () => props.is_comparison_enabled
);

const queryInProgress = computed(
    () => props.query_in_progress
);

const periodDates = computed(() => props.period_dates);

const oldPeriodDates = computed(
    () => props.old_period_dates
);

const tabItems = [
    {
        tab: 'financials',
        content: new Set([
            'avg_margin',
            'avg_margin_dollars',
            'total_volume',
            'total_spend',
            'total_margin',
            'avg_spend',
            'avg_cost'
        ])
    },
    {
        tab: 'performance',
        content: new Set([
            'avg_clt',
            'avg_prebook',
            'avg_blt',
            'avg_otp',
            'avg_otd',
            'prebook_percent'
        ])
    },
    {
        tab: 'projections',
        content: new Set([
            'proj_avg_margin',
            'proj_avg_margin_dollars',
            'proj_total_volume',
            'proj_total_spend',
            'proj_total_margin',
            'proj_avg_spend',
            'proj_avg_cost'
        ])
    }
];

const projectionPeriod = utils.PROJECTION_PERIOD;

function filterMetrics(km) {
    return km.filter((entry) =>
        tabItems[tabIndex.value]?.content?.has(entry.id)
    );
}

function getProjectionDates() {
    const start = new Date(
        appStore.startDate
    ).toLocaleDateString();

    const end = appStore.defaultProjectionDate.split('-');

    return `${start}-${end[1]}/${end[2]}/${end[0]}`;
}

function getMetricColor(colorTabKey) {
    if (colorTabKey === 'projection') {
        return theme.global.current.value.dark
            ? '#0091ff'
            : '#0D47A1';
    }

    return colorTabKey;
}
</script>

<style scoped>
#kmTabStyle {
    display: flex;
    align-items: flex-end;
    align-content: flex-end;
}

.moneyTab {
    border-right: 0.5px solid;
    border-top: 0.5px solid;
}

.moneyTabActive {
    border-right: 0 solid;
    border-top: 0 solid;
}

.performanceTab {
    border-right: 0.5px solid;
    border-left: 0.5px solid;
    border-top: 0.5px solid;
}

.performanceTabActive {
    border-right: 0 solid;
    border-left: 0 solid;
    border-top: 0 solid;
}

.projectionTab {
    border-left: 0.5px solid;
    border-top: 0.5px solid;
}

.projectionTabActive {
    border-left: 0 solid;
    border-top: 0 solid;
}
</style>