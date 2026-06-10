<template>
    <v-app>
        <NavBar />
        <SideBar />
        <v-main class="main-container">
            <v-container fluid style="width: 91%;">
                <v-row v-if="isAdminUser" dense>
                    <v-col cols="12" class="pb-0 mb-n8">
                        <p
                            class="text-end font-weight-light"
                            style="color: grey"
                        >
                            {{ dataFreshnessLabel }}
                        </p>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="2" class="pa-0">
                        <v-breadcrumbs
                            ref="breadcrumbs"
                            :items="crumbs"
                            divider=">"
                            class="mb-0 pt-4 mt-3 mr-4"
                        >
                        </v-breadcrumbs>
                    </v-col>
                    <v-col cols="8" class="pa-0">
                        <v-tabs
                            :model-value="
                                selectDashboardType == 'Broker Dashboard' ||
                                selectDashboardType == 'Shipper Dashboard'
                                    ? 0
                                    : 1
                            "
                            class="mt-3 mb-3"
                            color="rgba(0, 145, 255, 0.85)"
                            align-tabs="center"
                        >
                            <v-tab
                                v-if="!isBrokerUser"
                                @click="onBrokerDashboardClick()"
                                >Broker Dashboard</v-tab
                            >
                            <v-tab
                                v-if="isBrokerUser"
                                @click="onShipperDashboardClick()"
                                >Shipper Dashboard</v-tab
                            >
                            <v-tab @click="onLaneDashboardClick()">Lanes</v-tab>
                        </v-tabs>
                    </v-col>
                    <v-col cols="2" class="pa-0">
                        <p
                            ref="daterange"
                            class="text-end mb-0 pt-4 mt-3 mr-4 font-weight-light"
                            :style="{
                                color: theme == 'light' ? '#545454' : 'white'
                            }"
                        >
                            {{ periodDates }}
                        </p>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12">
                        <v-card elevation="5">
                            <v-card-title class="font-weight-light d-flex align-center">
                                <v-icon
                                    size="large"
                                    :color="'headerIcon'"
                                    style="margin-right: 10px"
                                    >mdi-gauge</v-icon
                                >
                                <p v-if="!isLaneData" class="ma-0">Dashboard</p>
                                <p v-else class="ma-0">Lanes</p>
                                <v-spacer></v-spacer>
                                <v-chip
                                    v-for="(keyval, index) in Array.from(
                                        filterChips
                                    )"
                                    :key="index"
                                    :color="'chipColor'"
                                    class="mr-2"
                                    closable
                                    @click:close="resetFilters(keyval[0])"
                                >
                                    {{ keyval[1] }}
                                </v-chip>

                                <Filters
                                    @applySelectedFilters="
                                        handleEmmittedFilters
                                    "
                                    :time_period="timePeriod"
                                    :volume_threshold="volumeThreshold"
                                    :is_lane_drilldown="!isLaneData"
                                    :is_analytics="false"
                                    :updateData="[
                                        filters,
                                        isComparisonEnabled
                                    ]"
                                />
                            </v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row dense v-resize="onResize">
                    <v-col cols="3">
                        <v-card
                            ref="gaugeCard"
                            elevation="5"
                            style="height: 100%"
                        >
                            <v-card-title class="font-weight-light pb-0"
                                >Truce Score</v-card-title
                            >
                            <v-card-actions class="pb-1 pt-0">
                                <Gauge
                                    :averageScore="averageScore"
                                    :gaugeCardWidth="gaugeCardWidth"
                                    :browserZoom="browserZoom"
                                />
                            </v-card-actions>
                        </v-card>
                    </v-col>

                    <v-col cols="5">
                        <KeyMetrics
                            ref="km"
                            :is_loading="isLoading"
                            :key_metrics="key_metrics"
                            :is_dashboard_km="true"
                            :updateKeyMetrics="[keyMetrics]"
                            :show_agg_tabs="showAggTabs"
                            @periodTabChange="handleKeyMetricTabChange"
                            :is_period_null="isPeriodNull"
                            :is_comparison_enabled="isComparisonEnabled"
                            :query_in_progress="queryInProgress"
                            :key_metrics_toggle="keyMetricsToggle"
                            :old_period_dates="oldPeriodDates"
                            :period_dates="periodDates"
                        />
                    </v-col>

                    <v-col cols="4">
                        <v-card elevation="5" style="height: 100%">
                            <v-card-title
                                class="font-weight-light pb-0 mtCardTitle"
                                style="overflow-y: hidden; white-space: nowrap"
                            >
                                <v-row>
                                    <v-col
                                        cols="lg-4 md-2"
                                        class="pb-0"
                                        style="z-index: 2"
                                        >Metric Trends</v-col
                                    >
                                    <v-col cols="lg-8 md-2" class="mtTabCol">
                                        <v-tabs
                                            color="#0091ff"
                                            align-tabs="end"
                                            show-arrows
                                            v-model="metricTrendTypeTabs"
                                            class="metricTrendTabs"
                                        >
                                            <v-tooltip
                                                text="Customer Spend Per Mile and
                                                    Broker Truck Cost Per
                                                    Mile"
                                                location="top"
                                                id="remove-v-tooltip"
                                                style="margin-left: auto"
                                            >
                                                <template #activator="{ props: tipProps }">
                                                    <v-tab
                                                        :disabled="
                                                            disableMetricTrendCPM ||
                                                            disableMetricTrendMPL ||
                                                            disableMetricTrendVOL
                                                        "
                                                        v-bind="tipProps"
                                                        @click="
                                                            changeMetricTrend(
                                                                'CPM',
                                                                0
                                                            )
                                                        "
                                                        >S|CPM</v-tab
                                                    >
                                                </template>
                                            </v-tooltip>
                                            <v-divider
                                                vertical
                                                inset
                                            ></v-divider>
                                            <v-tooltip
                                                text="Margin per Load"
                                                location="top"
                                            >
                                                <template #activator="{ props: tipProps }">
                                                    <v-tab
                                                        :disabled="
                                                            disableMetricTrendCPM ||
                                                            disableMetricTrendMPL ||
                                                            disableMetricTrendVOL
                                                        "
                                                        v-bind="tipProps"
                                                        @click="
                                                            changeMetricTrend(
                                                                'MPL',
                                                                1
                                                            )
                                                        "
                                                        >MPL</v-tab
                                                    >
                                                </template>
                                            </v-tooltip>
                                            <v-divider
                                                vertical
                                                inset
                                            ></v-divider>
                                            <v-tooltip
                                                text="Volume"
                                                location="top"
                                            >
                                                <template #activator="{ props: tipProps }">
                                                    <v-tab
                                                        :disabled="
                                                            disableMetricTrendCPM ||
                                                            disableMetricTrendMPL ||
                                                            disableMetricTrendVOL
                                                        "
                                                        v-bind="tipProps"
                                                        @click="
                                                            changeMetricTrend(
                                                                'VOL',
                                                                2
                                                            )
                                                        "
                                                        >VOL</v-tab
                                                    >
                                                </template>
                                            </v-tooltip>
                                        </v-tabs>
                                    </v-col>
                                </v-row>
                            </v-card-title>
                            <v-card-actions class="justify-center pt-0">
                                <Graph
                                    :rawData="metricTrends"
                                    :graphName="metricTrendType"
                                    :timeRange="timePeriod"
                                    :isBroker="!isLaneData"
                                ></Graph>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col cols="12">
                        <TableBundle
                            ref="bundle"
                            :is_loading="false"
                            :is_broker_user="isBrokerUser"
                            :is_lane_drilldown="false"
                            :is_lane_data="isLaneData"
                            :displayed_data="displayedData"
                            :original_data="originalData"
                            :has_incomplete_score="null"
                            @parseURL="parseURLPathName"
                            @handleFilters="handleEmmittedFilters"
                            @focusLanes="handleFocusLanes"
                            @laneClick="handleLaneClick"
                            :time_period="timePeriod"
                            :start_date="startDate"
                            :end_date="endDate"
                        />
                    </v-col>
                </v-row>
            </v-container>
            <v-dialog v-model="laneDrilldown" max-width="90%" scrim="black">
                <LaneDrilldown
                    :drilldown_object="drilldownObject"
                    :prop_broker="isBrokerUser"
                    @stopLoading="isLoading = false"
                />
            </v-dialog>
        </v-main>
        <SplashScreen style="z-index: 220" :is_loading="isLoading" />
    </v-app>
</template>

<script setup>
import { ref, computed, watch, onBeforeMount, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTheme } from 'vuetify';
import { useAppStore } from '../stores/appStore.js';
import _ from 'lodash';

// Component imports
import NavBar from '../components/NavBar.vue';
import Gauge from '../components/Gauge.vue';
import SideBar from '../components/SideBar.vue';
import TableBundle from './TableBundle.vue';
import KeyMetrics from '../components/KeyMetrics.vue';
import Graph from '../components/Graph.vue';
import SplashScreen from '../components/SplashScreen.vue';
import Filters from '../components/Filters.vue';
import LaneDrilldown from '../components/LaneDrilldown.vue';

// External modules/utilities
import * as user_analytics from '../analytics/sendAnalyticsEvent';
import * as format from '../formatShipmentData';
import * as utils from '../utils';
import * as computeKeyMetrics from '../computeKeyMetrics';
import * as fetchAccountDetails from '../fetchAccountDetails';

const router = useRouter();
const appStore = useAppStore();

// Template Refs
const breadcrumbs = ref(null);
const daterange = ref(null);
const gaugeCard = ref(null);
const km = ref(null);
const bundle = ref(null);

// Reactive State Variables (matching Vue 2 data)
const allowSecondLoad = ref(false);
const endDate = ref(new Date(new Date(appStore.storeEndDate || new Date()).setHours(5, 0, 0)));
const keyMetricsToggle = ref(null);
const keyMetrics = ref(null);
const dataFreshnessLabel = ref('');
const showAggTabs = ref(true);
const defaultTabValue = ref(null);
const averageScore = ref(0);
const isLaneData = ref(false);
const isLoading = ref(true);
const displayedData = ref([]);
const originalData = ref([]);
const selectDashboardType = ref('');
const metricTrends = ref(null);

// Lane Drilldown popup
const drilldownObject = ref(null);
const laneDrilldown = ref(false);

const percentColor = ref('#0091ff');
const centerShift = ref('margin-right:-43px;');

const value = ref(0);
const timePeriod = ref(appStore.storeTimePeriod);
const tickLabels = ['Last 7', 'Last 14', 'Last 30', 'Last 60', 'Last 90', 'All'];
const tickValues = [7, 14, 30, 60, 90];

const selectedEquipmentTypes = ref(appStore.equipment_type_list);
const EQUIPMENT_TYPE_LIST = ref(appStore.equipment_type_list);

const index_by = ref('brokerId');
const index_by_lane = ref('laneId');
const index_by_shipper = ref('shipperId');

const date = ref(new Date().toISOString().substring(0, 10));

const key_metrics = ref([
    {
        value: '0%',
        title: 'Avg. Margin',
        icon: '',
        color: '',
        id: 'avg_margin',
        change: ''
    },
    {
        value: '0$',
        title: 'MPL',
        icon: '',
        color: '',
        id: 'avg_margin_dollars',
        change: ''
    },
    {
        value: '0$',
        title: 'Total Margin',
        icon: '',
        color: '',
        id: 'total_margin',
        change: ''
    },
    {
        value: '0$',
        title: 'Total Spend',
        icon: '',
        color: '',
        id: 'total_spend',
        change: ''
    },
    {
        value: '0$',
        title: 'SPL',
        icon: '',
        color: '',
        id: 'avg_spend',
        change: ''
    },
    {
        value: '0',
        title: 'Volume',
        icon: '',
        color: '',
        id: 'total_volume',
        change: ''
    },
    {
        value: '0 Days',
        title: 'Avg. CLT',
        icon: '',
        color: '',
        id: 'avg_clt',
        change: ''
    },
    {
        value: '0 Days',
        title: 'Avg. BLT',
        icon: '',
        color: '',
        id: 'avg_blt',
        change: ''
    },
    {
        value: '0 Days',
        title: 'Avg. Pre-Book',
        icon: '',
        color: '',
        id: 'avg_prebook',
        change: ''
    },
    {
        value: '0%',
        title: 'On-Time Pickup',
        icon: '',
        color: '',
        id: 'avg_otp',
        change: ''
    },
    {
        value: '0%',
        title: 'On-Time Delivery',
        icon: '',
        color: '',
        id: 'avg_otd',
        change: ''
    },
    {
        value: '0%',
        title: 'Prebook',
        icon: '',
        color: '',
        id: 'prebook_percent',
        change: ''
    },
    {
        value: '0%',
        title: 'Avg. Margin',
        icon: '',
        color: '',
        id: 'proj_avg_margin',
        change: ''
    },
    {
        value: '0$',
        title: 'MPL',
        icon: '',
        color: '',
        id: 'proj_avg_margin_dollars',
        change: ''
    },
    {
        value: '0$',
        title: 'Total Margin',
        icon: '',
        color: '',
        id: 'proj_total_margin',
        change: ''
    },
    {
        value: '0$',
        title: 'Total Spend',
        icon: '',
        color: '',
        id: 'proj_total_spend',
        change: ''
    },
    {
        value: '0$',
        title: 'SPL',
        icon: '',
        color: '',
        id: 'proj_avg_spend',
        change: ''
    },
    {
        value: '0',
        title: 'Volume',
        icon: '',
        color: '',
        id: 'proj_total_volume',
        change: ''
    }
]);

const crumbs = ref([
    {
        title: '',
        text: '',
        disabled: true,
        href: '',
        equipmentType: null
    }
]);

const periodDates = ref('');
const oldPeriodDates = ref('');
const filterChips = ref(new Map());
const volumeThreshold = ref(appStore.storeVolumeThreshold);

const gaugeCardWidth = ref(0);
const gaugeCardHeight = ref(0);
const browserZoom = ref(100);
const showStartDate = ref(true);

const metricTrendType = ref('CPM');
const metricTrendTypeTabs = ref(0);
const metricTrendTypeIndex = ref(0);
const isPeriodOneDay = ref(false);
const isPeriodNull = ref(true);
const startDate = ref('');
const isBrokerUser = computed(() => appStore.role === 'broker');
const isAdminUser = computed(() => appStore.role === 'admin');
const deltaStartDate = ref(null);
const deltaEndDate = ref(null);
const showFilterChips = ref(false);
const cpmGraphArray = ref([]);
const mplGraphArray = ref([]);
const volGraphArray = ref([]);
const isComparisonEnabled = ref(appStore.storeIsComparisonEnabled);
const tabValues = [14, 30, 60];
const filters = ref({
    dates: appStore.storeDates,
    timeSlider: appStore.storeTimeSlider,
    volume: appStore.storeVolumeThreshold,
    equipment: appStore.equipment_type_list,
    isCustomerDirectEnabled: appStore.storeIsCustomerDirectEnabled
});
const isDashboard = ref(true);
const disableMetricTrendCPM = ref(true);
const disableMetricTrendMPL = ref(true);
const disableMetricTrendVOL = ref(true);
const load = ref(true);
const queryInProgress = ref(false);
const isCustomerDirectEnabled = ref(appStore.storeIsCustomerDirectEnabled);
const focusLanes = ref([]);

// Additional refs for state variables that external utilities expect
const hasIncompleteScore = ref(null);
const keyMetricDeltas = ref(null);
const query_params = ref({});
const dropdownSBList = ref([]);
const costSpendVolumeData = ref(null);
const costVolumeBarData = ref(null);
const cpmLaneCpmNetworkData = ref(null);
const onTimeGraphData = ref(null);
const selectedSB = ref(null);
const isTableLoading = ref(false);
const isDropdownLoading = ref(false);

// Formatting helpers
const formatScore = format.formatScore;
const formatPercent = format.formatPercent;
const formatDollars = format.formatDollars;
const formatDecimal = format.formatDecimal;
const getColor = utils.getColor;

// theme computed properties
const theme = computed(() => {
    return appStore.darkMode ? 'dark' : 'light';
});

// A Proxy object that maps option-like component instance accesses directly to composition refs/stores.
// This allows external scripts like utils.getData and computeKeyMetrics to execute unchanged.
const componentRefs = {
    isCustomerDirectEnabled,
    isBrokerUser,
    isLaneData,
    startDate,
    endDate,
    volumeThreshold,
    selectedEquipmentTypes,
    metricTrendType,
    deltaStartDate,
    deltaEndDate,
    isComparisonEnabled,
    filterChips,
    isPeriodOneDay,
    tickLabels,
    keyMetricsToggle,
    selectDashboardType,
    cpmGraphArray,
    mplGraphArray,
    volGraphArray,
    disableMetricTrendCPM,
    disableMetricTrendMPL,
    disableMetricTrendVOL,
    focusLanes,
    key_metrics,
    isDashboard,
    query_params,
    timePeriod,
    filters,
    periodDates,
    oldPeriodDates,
    isPeriodNull,
    displayedData,
    originalData,
    averageScore,
    hasIncompleteScore,
    keyMetrics,
    keyMetricDeltas,
    metricTrends,
    dataFreshnessLabel,
    dropdownSBList,
    costSpendVolumeData,
    costVolumeBarData,
    cpmLaneCpmNetworkData,
    onTimeGraphData,
    isLoading,
    load,
    queryInProgress,
    allowSecondLoad,
    metricTrendTypeTabs,
    metricTrendTypeIndex,
    EQUIPMENT_TYPE_LIST,
    selectedSB,
    isTableLoading,
    isDropdownLoading
};

const additionalProperties = {};

const componentProxy = new Proxy(additionalProperties, {
    get(target, prop) {
        if (prop === '$refs') {
            return {
                bundle: bundle.value
            };
        }
        if (prop in componentRefs) {
            const refVal = componentRefs[prop];
            return refVal.value !== undefined ? refVal.value : refVal;
        }
        return target[prop];
    },
    set(target, prop, value) {
        if (prop in componentRefs) {
            const refVal = componentRefs[prop];
            if (refVal && typeof refVal === 'object' && 'value' in refVal) {
                try {
                    refVal.value = value;
                } catch (e) {
                    target[prop] = value;
                }
            } else {
                componentRefs[prop] = value;
            }
            return true;
        }
        target[prop] = value;
        return true;
    }
});

// Methods
const resetFilters = (objType) => {
    isLoading.value = true;

    utils.resetFilters(
        objType,
        endDate.value,
        timePeriod.value,
        tickLabels,
        filterChips.value,
        volumeThreshold.value,
        isCustomerDirectEnabled.value,
        componentProxy
    );

    filters.value.isCustomerDirectEnabled = isCustomerDirectEnabled.value;
    if (filterChips.value.size === 0) {
        showFilterChips.value = false;
        showAggTabs.value = true;
        parseURLPathName();
    } else {
        handleEmmittedFilters(
            endDate.value,
            timePeriod.value,
            volumeThreshold.value,
            selectedEquipmentTypes.value,
            false,
            filters.value
        );
    }
};

const handleEmmittedFilters = (
    dateVal = endDate.value,
    timePeriodVal = timePeriod.value,
    volumeThresholdVal = volumeThreshold.value,
    equipmentTypesVal = selectedEquipmentTypes.value,
    isComparisonEnabledVal = isComparisonEnabled.value,
    filtersVal = filters.value
) => {
    isLoading.value = true;

    const milliToDay = 1000 * 60 * 60 * 24;

    // store filters state
    filters.value = filtersVal;

    // set time period
    timePeriod.value = timePeriodVal;
    appStore.storeTimePeriod = timePeriod.value;

    // set end date
    endDate.value = new Date(new Date(dateVal).setHours(5, 0, 0));
    appStore.storeEndDate = endDate.value;

    // calculate start date
    var start_offset = parseInt(timePeriod.value);
    startDate.value = new Date(
        new Date(
            new Date(endDate.value).getTime() - start_offset * milliToDay
        ).setHours(5, 0, 0)
    );
    load.value = false;

    isPeriodOneDay.value =
        endDate.value.toLocaleDateString() ===
        startDate.value.toLocaleDateString();

    // calculate delta end date
    deltaEndDate.value = new Date(
        new Date(
            new Date(endDate.value).getTime() -
                parseInt(timePeriod.value) * milliToDay
        ).setHours(5, 0, 0)
    );

    // calculate delta start date
    deltaStartDate.value = new Date(
        new Date(
            deltaEndDate.value.getTime() -
                (parseInt(timePeriod.value) - 1) * milliToDay
        ).setHours(5, 0, 0)
    );

    // set volume threshold
    volumeThreshold.value = volumeThresholdVal;
    appStore.storeVolumeThreshold = volumeThreshold.value;

    // set equipment types
    selectedEquipmentTypes.value = equipmentTypesVal;

    // set customer direct flag
    isCustomerDirectEnabled.value = filtersVal.isCustomerDirectEnabled;
    appStore.storeIsCustomerDirectEnabled = isCustomerDirectEnabled.value;

    // set new filter chips
    if (!(filterChips.value.size === 1 && filterChips.value.has('enddate'))) {
        setFilterChips(
            dateVal,
            timePeriod.value,
            volumeThreshold.value,
            equipmentTypesVal,
            filtersVal.isCustomerDirectEnabled
        );
    }

    // toggle off tabs
    showFilterChips.value = filterChips.value.size !== 0;
    showAggTabs.value = !showFilterChips.value;
    keyMetricsToggle.value = null;
    appStore.storeKeyMetricsToggle = keyMetricsToggle.value;

    isComparisonEnabled.value = isComparisonEnabledVal;
    appStore.storeIsComparisonEnabled = isComparisonEnabled.value;

    parseURLPathName();
};

const setFilterChips = (
    dateVal,
    timePeriodVal,
    volumeThresholdVal,
    selectedEquipmentTypesVal,
    isCustomerDirectEnabledVal
) => {
    var newFilterChips = new Map();

    const defaultStartDate = new Date(
        new Date(appStore.startDate).setHours(5, 0, 0)
    );

    const defaultEndDate = new Date();
    const defaultTimePeriod = (
        (new Date(defaultEndDate).getTime() -
            new Date(defaultStartDate).getTime()) /
            (24 * 60 * 60 * 1000) +
        1
    ).toFixed(0);

    if (
        new Date(dateVal).toLocaleDateString() !==
            defaultEndDate.toLocaleDateString() ||
        new Date(startDate.value).toLocaleDateString() !==
            defaultStartDate.toLocaleDateString()
    ) {
        newFilterChips = utils.updateFilterChips(
            'dateRange',
            'Date Range: ',
            isPeriodOneDay.value
                ? [new Date(dateVal).toLocaleDateString()]
                : [
                      new Date(startDate.value).toLocaleDateString() +
                          ' - ' +
                          new Date(dateVal).toLocaleDateString()
                  ],
            newFilterChips.size !== 0 ? newFilterChips : filterChips.value
        );
    }

    if (volumeThresholdVal > 0) {
        newFilterChips = utils.updateFilterChips(
            'volumeThreshold',
            'Volume: ',
            [parseInt(volumeThresholdVal)],
            newFilterChips.size !== 0 ? newFilterChips : filterChips.value
        );
    }

    var unselectedEquipmentTypes = new Set(EQUIPMENT_TYPE_LIST.value);

    if (unselectedEquipmentTypes.size !== selectedEquipmentTypesVal.length) {
        for (let i = 0; i < selectedEquipmentTypesVal.length; i++) {
            const equipmentType = selectedEquipmentTypesVal[i];
            unselectedEquipmentTypes.delete(equipmentType);
            newFilterChips = utils.updateFilterChips(
                'equipment' + '_' + equipmentType,
                'Equip. Type: ',
                [equipmentType],
                newFilterChips.size !== 0
                    ? newFilterChips
                    : filterChips.value
            );
        }
    }

    if (isCustomerDirectEnabledVal) {
        newFilterChips = utils.updateFilterChips(
            'isCustomerDirectEnabled',
            'Customer Direct',
            [''],
            newFilterChips.size !== 0 ? newFilterChips : filterChips.value
        );
    }

    filterChips.value = newFilterChips;
};

const handleKeyMetricTabChange = (tabNumber) => {
    isLoading.value = true;
    keyMetricsToggle.value = tabNumber;
    appStore.storeKeyMetricsToggle = keyMetricsToggle.value;
    var tp = tabValues[tabNumber];
    if (tp === undefined || tp === null) {
        const today = new Date(new Date().setHours(5, 0, 0));
        const start = new Date(
            new Date(appStore.startDate).setHours(1, 0, 0)
        );
        tp = (
            (today.getTime() - start.getTime()) /
                (24 * 60 * 60 * 1000) +
            1
        ).toFixed(0);
        endDate.value = today;
        startDate.value = start;
    }

    handleKeyMetricTabSelected(tp);
};

const handleKeyMetricTabSelected = (timePeriodVal) => {
    // calculate delta end date
    deltaEndDate.value = new Date(
        new Date(
            new Date(endDate.value).getTime() -
                parseInt(timePeriodVal) * 1000 * 60 * 60 * 24
        ).setHours(5, 0, 0)
    );

    // calculate start date
    startDate.value = new Date(
        new Date(
            new Date(endDate.value).getTime() -
                (parseInt(timePeriodVal) - 1) * 1000 * 60 * 60 * 24
        ).setHours(5, 0, 0)
    );
    deltaStartDate.value = new Date(
        new Date(
            deltaEndDate.value.getTime() -
                (parseInt(timePeriodVal) - 1) * 1000 * 60 * 60 * 24
        ).setHours(5, 0, 0)
    );

    //show tabs
    showAggTabs.value = true;
    showFilterChips.value = true;

    //set filter param
    const tickValIdx = tickValues.indexOf(timePeriodVal);
    filters.value.timeSlider = tickValIdx !== -1 ? tickValIdx : 5;

    // set timePeriod
    timePeriod.value = timePeriodVal;

    setFilterChips(
        endDate.value,
        timePeriodVal,
        volumeThreshold.value,
        selectedEquipmentTypes.value
    );

    parseURLPathName();
};

const computeKeyMetricsFilters = () => {
    const showChange =
        filterChips.value.size === 0 && keyMetricsToggle.value === null
            ? false
            : isComparisonEnabled.value;
    computeKeyMetrics.getKeyMetricsForTabs(
        key_metrics.value,
        showChange,
        componentProxy,
        true
    );
};

const onBrokerDashboardClick = () => {
    router.push({
        name: 'broker-dashboard',
    });
};

const onShipperDashboardClick = () => {
    router.push({
        name: 'shipper-dashboard',
    });
};

const onLaneDashboardClick = () => {
    router.push({
        name: 'lane-dashboard',
    });
};

const clearState = () => {
    appStore.first_load = true;
    appStore.brokerList = [];
    appStore.shipperList = [];
    appStore.laneList = [];
};

const parseURLPathName = (isTableChange = false) => {
    queryInProgress.value = true;
    var url_string = window.location.href;
    var url = new URL(url_string);
    var selectDashboardTypeVal;
    isLaneData.value = false;
    if (url.pathname === '/app/brokerDashboard') {
        selectDashboardTypeVal = 'Broker Dashboard';
    } else if (url.pathname === '/app/shipperDashboard') {
        selectDashboardTypeVal = 'Shipper Dashboard';
    } else if (url.pathname === '/app/laneDashboard') {
        selectDashboardTypeVal = 'Lanes';
        isLaneData.value = true;
    }
    selectDashboardType.value = selectDashboardTypeVal;

    utils.getData(componentProxy, 'dashboard', isTableChange).then(() => {
        utils.formatDates(
            startDate.value,
            endDate.value,
            timePeriod.value,
            componentProxy
        );
        computeKeyMetricsFilters();
        metricTrendTypeTabs.value = metricTrendTypeIndex.value;
        allowSecondLoad.value = true;
        queryInProgress.value = false;
        isLoading.value = false;
    });
    return selectDashboardTypeVal;
};

const onResize = () => {
    if (gaugeCard.value) {
        gaugeCardWidth.value = gaugeCard.value.$el?.clientWidth || gaugeCard.value?.clientWidth || 0;
    }
    browserZoom.value = Math.round(window.devicePixelRatio * 100);

    const mtCardTitleEl = document.querySelector('.mtCardTitle');
    const mtCardWidth = mtCardTitleEl ? mtCardTitleEl.clientWidth : 0;
    
    if (mtCardWidth < 400) {
        document.querySelectorAll('.metricTrendTabs .v-tab').forEach((tab) => {
            tab.style.fontSize = '.7rem';
        });
        const mtTabColEl = document.querySelector('.mtTabCol');
        if (mtTabColEl) mtTabColEl.style.paddingRight = '0px';
    } else {
        document.querySelectorAll('.metricTrendTabs .v-tab').forEach((tab) => {
            tab.style.fontSize = '.9rem';
        });
        const mtTabColEl = document.querySelector('.mtTabCol');
        if (mtTabColEl) mtTabColEl.style.paddingRight = '12px';
    }
};

const changeMetricTrend = (metricType, index) => {
    if (
        !disableMetricTrendCPM.value &&
        !disableMetricTrendMPL.value &&
        !disableMetricTrendVOL.value
    ) {
        metricTrendType.value = metricType;
        metricTrendTypeIndex.value = index;
        if (metricType === 'CPM') {
            metricTrends.value = _.cloneDeep(cpmGraphArray.value);
        } else if (metricType === 'MPL') {
            metricTrends.value = _.cloneDeep(mplGraphArray.value);
        } else if (metricType === 'VOL') {
            metricTrends.value = _.cloneDeep(volGraphArray.value);
        }
    }
};

const handleFocusLanes = (val) => {
    isLoading.value = true;
    focusLanes.value = val;
    parseURLPathName(true);
};

const handleLaneClick = (event) => {
    isLoading.value = true;
    drilldownObject.value = event;
    laneDrilldown.value = true;
};

// Watchers
watch(laneDrilldown, (isOpen) => {
    if (!isOpen) {
        document.documentElement.style.overflow = 'auto';
    } else {
        document.documentElement.style.overflow = 'hidden';
    }
});

// Lifecycle hooks
onBeforeMount(() => {
    window.component = componentProxy;
    window.api = {
        getStateProperty: (ctx, prop) => appStore[prop],
        setStateProperty: (ctx, prop, val) => { appStore[prop] = val; }
    };
    window.clear = clearState;
    const url = new URL(window.location.href);
    var url2 = new URL(url);
    if (url2.pathname === '/app/brokerDashboard') {
        selectDashboardType.value = 'Broker Dashboard';
    } else if (url2.pathname === '/app/shipperDashboard') {
        selectDashboardType.value = 'Shipper Dashboard';
    } else if (url2.pathname === '/app/laneDashboard') {
        selectDashboardType.value = 'Lanes';
    }

    if (appStore.first_load) {
        fetchAccountDetails
            .getAccountDetails({
                email: appStore.email
            })
            .then(() => {
                startDate.value = new Date(appStore.startDate);
                const today = new Date(new Date().setHours(5, 0, 0));
                timePeriod.value = (
                    (today.getTime() - startDate.value.getTime()) /
                    (24 * 60 * 60 * 1000)
                ).toFixed(0);

                const kmt = appStore.storeKeyMetricsToggle;
                if (kmt == null || kmt === undefined) {
                    handleEmmittedFilters(
                        endDate.value,
                        timePeriod.value,
                        volumeThreshold.value,
                        selectedEquipmentTypes.value,
                        isComparisonEnabled.value,
                        filters.value
                    );
                } else {
                    handleKeyMetricTabChange(kmt);
                }

                crumbs.value = [
                    {
                        title: selectDashboardType.value,
                        text: selectDashboardType.value,
                        disabled: true,
                        href: url2.pathname,
                        equipmentType: null
                    }
                ];
                appStore.crumbs = crumbs.value;
                appStore.crumbIds = ['dashboard'];
            });
    } else {
        const kmt = appStore.storeKeyMetricsToggle;
        if (kmt == null || kmt === undefined) {
            handleEmmittedFilters(
                endDate.value,
                timePeriod.value,
                volumeThreshold.value,
                selectedEquipmentTypes.value,
                isComparisonEnabled.value,
                filters.value
            );
        } else {
            handleKeyMetricTabChange(kmt);
        }

        crumbs.value = [
            {
                title: selectDashboardType.value,
                text: selectDashboardType.value,
                disabled: true,
                href: url2.pathname,
                equipmentType: null
            }
        ];
        appStore.crumbs = crumbs.value;
        appStore.crumbIds = ['dashboard'];
    }

    // Send pageView analytics event
    const emailVal = appStore.email;
    const companyVal = appStore.company;
    const roleVal = appStore.role;
    user_analytics.sendEvent(emailVal, companyVal, roleVal, 'pageView', {
        pageSource: selectDashboardType.value.replaceAll(' ', '')
    });
});

onMounted(() => {
    var metric_el = document.getElementById('remove-v-tooltip');
    if (metric_el) {
        metric_el.classList.remove('v-tooltip');
        metric_el.classList.remove('v-tooltip--top');
    }

    if (gaugeCard.value) {
        gaugeCardHeight.value = gaugeCard.value.$el?.clientHeight || gaugeCard.value?.clientHeight || 0;
        gaugeCardWidth.value = gaugeCard.value.$el?.clientWidth || gaugeCard.value?.clientWidth || 0;
    }
    browserZoom.value = Math.round(window.devicePixelRatio * 100);
});
</script>

<style lang="scss">
.green {
    color: green;
}

.red {
    color: red;
}

.metric-value {
    font-weight: 400;
    font-size: 23px;
}

tbody {
    tr:hover {
        cursor: pointer;
    }
}

ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.metricTrendTabs .v-tab {
    min-width: fit-content;
}

.v-theme--dark {
    .v-card {
        background-color: rgb(var(--v-theme-cardBackgroundColor));
    }

    .moneyTab {
        background-color: rgb(var(--v-theme-cardBackgroundColor));
    }

    .projectionTab {
        background-color: rgb(var(--v-theme-cardBackgroundColor));
    }

    .performanceTab {
        background-color: rgb(var(--v-theme-cardBackgroundColor));
    }

    .selectorDateTabs .v-slide-group {
        background-color: rgb(var(--v-theme-cardBackgroundColor)) !important;
    }

    .metricTrendTabs .v-slide-group {
        background-color: rgb(var(--v-theme-cardBackgroundColor)) !important;
    }

    .metric-value {
        color: rgb(var(--v-theme-metricValueColor));
    }

    .darkModeSwitch .v-label {
        color: rgb(var(--v-theme-metricValueColor));
    }
}
</style>
