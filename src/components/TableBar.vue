<template>
    <v-row justify="end">
        <v-col
            cols="4"
            class="my-auto pl-6 pt-5"
        >
            {{ tableType }} Table
        </v-col>

        <v-col cols="2" />

        <v-col
            cols="6"
            align-self="end"
        >
            <template v-if="!showSelect">
                <v-row
                    class="pr-6"
                    style="justify-content: flex-end"
                >
                    <v-text-field
                        v-model="searchTable"
                        :label="
                            isLaneData
                                ? 'Search origin or destination'
                                : `Search ${tableType}s`
                        "
                        hide-details
                        single-line
                        rounded
                        density="compact"
                        variant="solo"
                        :bg-color="
                            isDark
                                ? '#212121'
                                : '#eeeeee'
                        "
                        multiple
                        class="pr-2 pb-2 elevation-0 tableSearch"
                        style="
                            margin-top: -1px;
                            max-width: 660px;
                        "
                        clearable
                        @change="filterTable"
                        @click:clear="clearTable"
                        @keyup.enter.prevent="filterTable"
                    >
                        <template #prepend>
                            <template
                                v-if="
                                    focusFieldsStore.length > 0
                                "
                            >
                                <v-tooltip
                                    location="top"
                                >
                                    <template
                                        #activator="{ props }"
                                    >
                                        <v-btn
                                            :color="
                                                focusLaneButtonColor
                                            "
                                            icon
                                            v-bind="props"
                                            @click="
                                                clearFocus()
                                            "
                                        >
                                            <v-icon>
                                                mdi-restore
                                            </v-icon>
                                        </v-btn>
                                    </template>

                                    <span>
                                        Clear Focus
                                    </span>
                                </v-tooltip>
                            </template>

                            <v-menu
                                v-if="isLaneData"
                                v-model="focusMenu"
                                location="bottom"
                                :close-on-content-click="false"
                                :close-on-click="false"
                                content-class="elevation-4"
                            >
                                <template
                                    #activator="{ props }"
                                >
                                    <v-tooltip
                                        location="top"
                                    >
                                        <template
                                            #activator="{
                                                props: tooltipProps
                                            }"
                                        >
                                            <v-btn
                                                id="focusBtn"
                                                icon
                                                v-bind="{
                                                    ...props,
                                                    ...tooltipProps
                                                }"
                                                @click="
                                                    storeFocusFields()
                                                "
                                                :color="
                                                    focusLaneButtonColor
                                                "
                                            >
                                                <v-icon>
                                                    mdi-focus-field
                                                </v-icon>
                                            </v-btn>
                                        </template>

                                        <span>
                                            Focus Lane
                                            Filter
                                        </span>
                                    </v-tooltip>
                                </template>

                                <v-card
                                    class="px-2 pt-2"
                                >
                                    <v-radio-group
                                        v-model="
                                            focusFieldModel
                                        "
                                    >
                                        <v-radio
                                            v-for="(
                                                item,
                                                i
                                            ) in focusFields"
                                            :key="`item-${i}`"
                                            :label="item"
                                            :value="item"
                                        />
                                    </v-radio-group>

                                    <v-card-actions>
                                        <v-spacer />

                                        <v-btn
                                            variant="text"
                                            color="blue"
                                            class="pa-2 ma-1"
                                            @click="
                                                focusLaneCancel()
                                            "
                                        >
                                            Cancel
                                        </v-btn>

                                        <v-btn
                                            variant="text"
                                            color="blue"
                                            class="pa-2 ma-1"
                                            @click="
                                                focusLanesToggle()
                                            "
                                            :disabled="
                                                focusFieldModel ==
                                                    undefined ||
                                                focusFieldModel
                                                    .length ==
                                                    0
                                            "
                                        >
                                            Ok
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-menu>

                            <v-tooltip
                                location="top"
                            >
                                <template
                                    #activator="{ props }"
                                >
                                    <v-btn
                                        v-if="
                                            isLaneData &&
                                            !isDashboard &&
                                            isCalcEnabled
                                        "
                                        icon
                                        v-bind="props"
                                        @click="
                                            repriceNetworkSelection()
                                        "
                                    >
                                        <v-icon
                                            :color="
                                                theme ===
                                                'light'
                                                    ? '#757575'
                                                    : 'white'
                                            "
                                        >
                                            $calc
                                        </v-icon>
                                    </v-btn>
                                </template>

                                <span>
                                    Calculator
                                </span>
                            </v-tooltip>

                            <v-tooltip
                                location="top"
                            >
                                <template
                                    #activator="{ props }"
                                >
                                    <v-btn
                                        v-if="
                                            isLaneData &&
                                            !isDashboard
                                        "
                                        :color="
                                            isFavoritesApplied
                                                ? 'orange'
                                                : 'inherit'
                                        "
                                        icon
                                        v-bind="props"
                                        @click="
                                            getFavoriteLanes()
                                        "
                                    >
                                        <v-icon>
                                            mdi-star-outline
                                        </v-icon>
                                    </v-btn>
                                </template>

                                <span>
                                    Favorites
                                </span>
                            </v-tooltip>

                            <v-menu
                                location="bottom"
                                :close-on-content-click="false"
                                content-class="elevation-4"
                            >
                                <template
                                    #activator="{ props }"
                                >
                                    <v-tooltip
                                        location="top"
                                    >
                                        <template
                                            #activator="{
                                                props: tooltipProps
                                            }"
                                        >
                                            <v-btn
                                                icon
                                                class="mr-2"
                                                v-bind="{
                                                    ...props,
                                                    ...tooltipProps
                                                }"
                                            >
                                                <v-icon>
                                                    mdi-dots-grid
                                                </v-icon>
                                            </v-btn>
                                        </template>

                                        <span>
                                            Table Menu
                                        </span>
                                    </v-tooltip>
                                </template>

                                <v-list>
                                    <v-list-item>
                                        <v-switch
                                            color="#FF6F00"
                                            inset
                                            @change="
                                                handleAccessorial()
                                            "
                                            v-model="
                                                includeAcc
                                            "
                                        >
                                            <template #label>
                                                <span
                                                    class="pl-3"
                                                >
                                                    Accessorials
                                                </span>
                                            </template>
                                        </v-switch>
                                    </v-list-item>

                                    <v-list-item
                                        v-if="isLaneData"
                                    >
                                        <v-switch
                                            color="#0091ff"
                                            inset
                                            @change="
                                                emit(
                                                    'toggleAgg',
                                                    $event
                                                )
                                            "
                                            v-model="
                                                isWeeklyView
                                            "
                                        >
                                            <template #label>
                                                <span
                                                    class="pl-3"
                                                >
                                                    Weekly
                                                </span>
                                            </template>
                                        </v-switch>
                                    </v-list-item>

                                    <v-list-item
                                        v-if="
                                            isDashboard &&
                                            !isLaneData &&
                                            !isBrokerUser
                                        "
                                    >
                                        <v-switch
                                            color="#7B91FF"
                                            inset
                                            @change="
                                                handleActiveBrokersOnlyToggle()
                                            "
                                            v-model="
                                                showActiveBrokersOnly
                                            "
                                        >
                                            <template #label>
                                                <span
                                                    class="pl-3"
                                                >
                                                    Active
                                                    Brokers
                                                    Only
                                                </span>
                                            </template>
                                        </v-switch>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-switch
                                            color="#7B91FF"
                                            inset
                                            @change="
                                                viewTogglehandler(
                                                    $event
                                                )
                                            "
                                            v-model="
                                                isFullView
                                            "
                                        >
                                            <template #label>
                                                <span
                                                    class="pl-3"
                                                >
                                                    Full View
                                                </span>
                                            </template>
                                        </v-switch>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </template>

                        <template #prepend-inner>
                            <v-btn
                                @click="filterTable"
                                elevation="0"
                                size="small"
                                :ripple="false"
                                variant="plain"
                                class="px-0"
                                style="
                                    min-width: auto !important;
                                "
                            >
                                <v-icon>
                                    mdi-magnify
                                </v-icon>
                            </v-btn>
                        </template>
                    </v-text-field>
                </v-row>
            </template>

            <template v-else>
                <v-row class="pl-8 pt-2">
                    <v-col
                        class="text-right"
                        cols="6"
                    />

                    <v-col
                        cols="6"
                        align="right"
                    >
                        <v-btn
                            color="#7385E6"
                            @click="
                                submitNetworkSelection()
                            "
                            variant="text"
                            style="
                                border-bottom: 0px
                                    solid blue !important;
                            "
                            class="mb-1"
                        >
                            Reprice
                        </v-btn>

                        <v-btn
                            color="red"
                            @click="
                                repriceNetworkSelection()
                            "
                            variant="text"
                            style="
                                border-bottom: 0px
                                    solid blue !important;
                            "
                            class="mb-1"
                        >
                            Cancel
                        </v-btn>
                    </v-col>
                </v-row>
            </template>
        </v-col>
    </v-row>
</template>

<script setup>
import {
    ref,
    computed,
    watch,
    onBeforeMount
} from 'vue';

import { useTheme } from 'vuetify';
import { useRouter } from 'vue-router';

import { useAppStore } from '@/stores/appStore';
import * as globalVariables from '../globalVariables';
import * as utils from '../utils';

import _ from 'lodash';

const appStore = useAppStore();

const props = defineProps({
    is_lane_drilldown: Boolean,
    is_lane_data: Boolean,
    is_broker_user: Boolean,
    table_type: String,
    selected_lanes: Object,
    is_dashboard: Boolean,
    is_table_loading: Boolean,
    is_dropdown_loading: Boolean,
    time_period: [String, Number],
    end_date: [String, Date],
    start_date: [String, Date],
    show_agg_tabs: {
        type: Boolean,
        default: true
    }
});

const showAggTabs = computed(() => props.show_agg_tabs);

const emit = defineEmits([
    'busEvent',
    'toggleAgg',
    'toggleView',
    'parseURL',
    'handleFilters',
    'focusLanes',
    'favoriteLanes',
    'toggleActiveBrokersOnly'
]);

const router = useRouter();

const vuetifyTheme = useTheme();

const isDark = computed(
    () => vuetifyTheme.global.current.value.dark
);

const theme = computed(() =>
    isDark.value ? 'dark' : 'light'
);

const role = computed(() => appStore.role);

const settings = computed(() => appStore.table_settings);

const type = ref('');

const searchTable = ref(null);

const isLaneDrilldown = ref(
    props.is_lane_drilldown
);

const isLaneData = ref(props.is_lane_data);

const isBrokerUser = ref(
    props.is_broker_user
);

const isWeeklyView = ref(false);

const isFullView = ref(false);

const nav = ref(null);

const tableType = ref(props.table_type);

const isDashboard = ref(props.is_dashboard);

const selectedLanes = ref(
    props.selected_lanes
);

const selectedEquipmentTypes = computed(() => appStore.equipment_type_list);

const showSelect = ref(false);

const includeAcc = ref(utils.COGS_REV.WITH_ACC);

const isTableLoading = ref(
    props.is_table_loading
);

const isDropdownLoading = ref(
    props.is_dropdown_loading
);

const headersShipments = ref(
    globalVariables.default.headers_shipments
);

const timePeriod = ref(props.time_period);

const endDate = ref(props.end_date);

const startDate = ref(props.start_date);

const isCalcEnabled = computed(() => appStore.calc_enabled);

const focusFields = ref([
    'High Margin',
    'High Margin/Late Delivery',
    'High Margin/Low Margin',
    'Low Margin',
    'Late Pickup',
    'Late Delivery',
    'Low Prebook'
]);

const focusFieldModel = ref([]);

const focusFieldsStore = ref([]);

const focusMenu = ref(false);

const focusLaneButtonColor = ref('inherit');

const isFavoritesApplied = ref(false);

const showActiveBrokersOnly = ref(true);

const searchPrev = ref(null);

const tableBus = computed(() => ({
    showSelect: showSelect.value,
    isTableLoading: isTableLoading.value,
    isDropdownLoading:
        isDropdownLoading.value,
    isWeeklyView: isWeeklyView.value,
    headersShipments:
        headersShipments.value,
    searchTable: searchTable.value
}));

watch(
    tableBus,
    () => {
        emit('busEvent', tableBus.value);
    },
    {
        deep: true
    }
);

watch(
    () => props.is_table_loading,
    (val) => {
        isTableLoading.value = val;
    }
);

watch(
    () => props.is_dropdown_loading,
    (val) => {
        isDropdownLoading.value = val;
    }
);

watch(
    () => props.selected_lanes,
    (val) => {
        selectedLanes.value = val;
    }
);

onBeforeMount(() => {
    nav.value = isLaneDrilldown.value
        ? 'laneDrilldown'
        : isDashboard.value
        ? 'dashboard'
        : 'drilldown';
});

const handleAccessorial = () => {
    isTableLoading.value = true;

    if (timePeriod.value == null) {
        timePeriod.value = (
            (new Date(endDate.value).getTime() -
                new Date(
                    startDate.value
                ).getTime()) /
                (24 * 60 * 60 * 1000) +
            1
        ).toFixed(0);
    }

    if (showAggTabs.value === true) {
        emit('parseURL');
    } else {
        emit('handleFilters');
    }
};

const handleActiveBrokersOnlyToggle =
    () => {
        emit('toggleActiveBrokersOnly');
    };

const repriceNetworkSelection = () => {
    showSelect.value = !showSelect.value;
};

const submitNetworkSelection = () => {
    const broker = appStore.broker;

    const shipper = appStore.shipper;

    const tempTimePeriod = (
        (new Date().getTime() -
            new Date(
                startDate.value
            ).getTime()) /
            (24 * 60 * 60 * 1000) +
        1
    ).toFixed(0);

    const tempStartDate =
        tempTimePeriod > 30
            ? new Date(
                  new Date().setDate(
                      new Date().getDate() -
                          30
                  )
              )
            : startDate.value;

    if (
        selectedLanes.value == null ||
        Object.keys(
            selectedLanes.value
        ) != 0
    ) {
        router.push({
            name: 'calculator',
            params: {
                prop_selected:
                    selectedLanes.value,
                prop_id: isBrokerUser.value
                    ? shipper
                    : broker
            }
        });
    }
};

const filterTable = (val) => {
    if (val === searchPrev.value) {
        return;
    }

    searchPrev.value = val;

    isTableLoading.value = true;

    emit('parseURL', true);
};

const clearTable = () => {
    searchTable.value = null;

    emit('busEvent', tableBus.value);

    filterTable();
};

const viewTogglehandler = (val) => {
    emit('toggleView', val);
};

const focusLanesToggle = () => {
    focusFieldsStore.value =
        focusFieldModel.value;

    focusMenu.value = false;

    focusLaneButtonColor.value =
        focusFieldModel.value.length === 0
            ? 'inherit'
            : '#2AC08E';

    emit(
        'focusLanes',
        Array.isArray(
            focusFieldModel.value
        )
            ? focusFieldModel.value
            : [focusFieldModel.value]
    );
};

const focusLaneCancel = () => {
    focusMenu.value = false;

    focusFieldModel.value =
        focusFieldsStore.value;
};

const storeFocusFields = () => {
    focusFieldModel.value =
        focusFieldsStore.value;
};

const clearFocus = () => {
    focusFieldModel.value = [];

    focusLanesToggle();
};

const getFavoriteLanes = () => {
    const drilldownId = isBrokerUser.value ? appStore.shipper : appStore.broker;

    const favoriteLanes = (appStore.favoriteLanes || {})[drilldownId];

    if (
        favoriteLanes != undefined &&
        favoriteLanes.length != 0
    ) {
        isFavoritesApplied.value =
            !isFavoritesApplied.value;

        emit(
            'favoriteLanes',
            isFavoritesApplied.value
                ? favoriteLanes
                : []
        );
    } else {
        isFavoritesApplied.value = false;
    }
};

defineExpose({
    includeAcc,
    isWeeklyView,
    isDropdownLoading,
    showActiveBrokersOnly
});
</script>

<style lang="scss" scoped>
.tableSearch :deep(.v-field) {
    padding-left: 8px !important;
}

.tableSearch :deep(.v-input__prepend) {
    margin: 0 !important;
}
</style>