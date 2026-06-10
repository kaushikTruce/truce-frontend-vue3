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
                            :items="crumbs"
                            divider=">"
                            class="mb-0 pt-4 mt-3 mr-4"
                        >
                        </v-breadcrumbs>
                    </v-col>
                    <v-col cols="8" class="pa-0">
                        <v-tabs
                            class="mt-3 mb-3"
                            color="rgba(0, 145, 255, 0.85)"
                            align-tabs="center"
                        >
                            <v-tab
                                v-if="!isBrokerUser"
                                @click="onBrokerDashboardClick()"
                            >
                                Broker Dashboard
                            </v-tab>
                            <v-tab
                                v-if="isBrokerUser"
                                @click="onShipperDashboardClick()"
                            >
                                Shipper Dashboard
                            </v-tab>
                            <v-tab @click="onLaneDashboardClick()">Lanes</v-tab>
                        </v-tabs>
                    </v-col>
                    <v-col cols="2" class="pa-0">
                        <p
                            class="text-end mb-0 pt-4 mt-3 mr-4 font-weight-light"
                            :style="{color: isDarkMode == 'light' ? '#545454' : 'white'}"
                        >
                            {{ periodDates }}
                        </p>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12">
                        <v-card elevation="5">
                            <v-card-title class="d-flex align-center font-weight-light">
                                <v-icon
                                    large
                                    :color="'headerIcon'"
                                    style="margin-right: 10px"
                                >mdi-gauge</v-icon>
                                <p 
                                    v-if="!isLaneData"
                                    class="ma-0"
                                >Dashboard</p>
                                <p v-else class="ma-0">Lanes</p>

                                <v-spacer />

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
                                    {{keyval[1]}}
                                </v-chip>
                                
                                <Filters />

                            </v-card-title>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col cols="3">
                        <v-card
                            elevation="5"
                            style="height: 100%"
                        >
                            <v-card-title class="font-weight-light pb-0">
                                Truce Score
                            </v-card-title>
                            <v-card-actions class="pb-1 pt-0">
                                <Gauge 
                                    :average-score="averageScore"
                                    :gauge-card-width="gaugeCardWidth"
                                    :browser-zoom="browserZoom"
                                />
                            </v-card-actions>
                        </v-card>
                    </v-col>

                    <v-col cols="5">
                        <KeyMetrics />
                    </v-col>
                    
                    <v-col cols="4">
                        <v-card elevation="5" style="height: 100%;">
                            <v-card-title
                                class="font-weight-light pb-0 mtCardTitle"
                                style="overflow-y: hidden; white-space: nowrap"
                            >
                                <v-row>
                                    <v-col
                                        lg="4"
                                        md="2"
                                        class="pb-0"
                                        style="z-index: 2;"
                                    >Metric Trends</v-col
                                >
                                <v-col
                                    lg="8"
                                    md="2"
                                    class="mtTabCol"
                                >
                                    <v-tabs
                                        color="#0091ff"
                                        align-tabs="end"
                                        show-arrows
                                        class="metricTrendTabs"
                                    >
                                        <v-tooltip
                                            text="Customer Spend Per Mile and Broker Truck Cost Per Mile"
                                            location="top"
                                            id="remove-v-tooltip"
                                            style="margin-left: auto"
                                        >
                                            <template #activator="{ props }">
                                                <v-tab v-bind="props">
                                                    S|CPM
                                                </v-tab>
                                            </template>
                                        </v-tooltip>
                                        <v-divider 
                                            vertical 
                                            inset
                                        >
                                        </v-divider>
                                        <v-tooltip
                                            text="Margin per load"
                                            location="top"
                                        >
                                            <template #activator="{ props }">
                                                <v-tab v-bind="props">
                                                    MPL
                                                </v-tab>
                                            </template>
                                        </v-tooltip>
                                        <v-divider 
                                            vertical 
                                            inset
                                        >
                                        </v-divider>
                                        <v-tooltip
                                            text="Volume"
                                            location="top"
                                        >
                                            <template #activator="{ props }">
                                                <v-tab v-bind="props">
                                                    VOL
                                                </v-tab>
                                            </template>
                                        </v-tooltip>
                                    </v-tabs>
                                </v-col>
                                </v-row>
                            </v-card-title>

                            <v-card-actions
                                class="justify-center pt-0"
                            >
                                Graph Component Here
                            </v-card-actions>
                        </v-card>
                    </v-col>

                </v-row>

            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { computed, ref } from 'vue';
import NavBar from '../components/NavBar.vue';
import SideBar from '../components/SideBar.vue';
import { useAppStore } from '../stores/appStore.js';
import { useRouter } from 'vue-router';
import { resetFilters } from '../utils.js';
import Filters from '../components/Filters.vue';
import Gauge from '../components/Gauge.vue';
import KeyMetrics from '../components/KeyMetrics.vue';

const appStore = useAppStore();
const router = useRouter();

const isAdminUser = computed(() => appStore.role === 'admin')
const isBrokerUser = computed(() => appStore.role === 'broker')
const isDarkMode = computed(() => appStore.darkMode ? 'dark' : 'light');

const dataFreshnessLabel = ref('');
const crumbs = ref([
    {
        title: '',
        text: '',
        disabled: true,
        href: '',
        equipmentType: null
    }
])
const periodDates = ref('');
const isLaneData = ref(false);
const filterChips = ref(new Map());
const averageScore = ref(0);
const gaugeCardWidth = ref(0);
const browserZoom = ref(100);

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
