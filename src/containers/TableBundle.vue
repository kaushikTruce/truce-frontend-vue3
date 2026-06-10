<template>
    <v-card elevation="5" height="100%" :loading="isLoading">
        <v-card-title class="font-weight-light pa-2">
            <TableBar
                ref="bar"
                :is_broker_user="isBrokerUser"
                :is_lane_drilldown="isLaneDrilldown"
                :is_lane_data="isLaneData"
                :table_type="tableType"
                :is_dashboard="isDashboard"
                :selected_lanes="selectedLanes"
                :is_table_loading="isTableLoading"
                :is_dropdown_loading="isDropdownLoading"
                @busEvent="handleBus"
                @toggleAgg="toggleAggregate"
                @toggleView="toggleFullView"
                @focusLanes="handleFocusLanes"
                @favoriteLanes="handleFavoriteLanes"
                @toggleActiveBrokersOnly="handleActiveBrokersOnlyToggle"
                :time_period="timePeriod"
                :start_date="startDate"
                :end_date="endDate"
                :show_agg_tabs="show_agg_tabs"
            />
        </v-card-title>
        <DataTable
            ref="table"
            v-if="displayedData && displayedData.length > 0"
            @dataTableOptionUpdate="handleUpdatedOptions"
            @dataTableOptionUpdateShipments="handleUpdatedOptionsShipments"
            @dataTableSelectionUpdate="handleUpdatedSelection"
            @laneClick="handleLaneClick"
            :headers_array="headers"
            :headers_shipments="headersShipments"
            :displayed_data="displayedData"
            :is_shipper_dashboard="isDashboard"
            :server_items_length="serverItemsLength"
            :server_items_length_shipments="serverItemsLengthShipments"
            :is_lane_data="isLaneData"
            :has_incomplete_score="hasIncompleteScore"
            :percentToDollars="[
                headers,
                headersShipments,
                displayedData,
                !isWeeklyView,
                serverItemsLength,
                serverItemsLengthShipments,
                isTableLoading,
                isDropdownLoading
            ]"
            :show_select="showSelect"
        />
        <div v-else class="pa-4 text-center text-grey font-weight-light">
            No data available
        </div>
    </v-card>
</template>

<script setup>
import { ref, watch, computed, onBeforeMount } from 'vue';
import TableBar from '../components/TableBar.vue';
import DataTable from '../components/DataTable.vue';
import * as globalVariables from '../globalVariables';
import _ from 'lodash';
import { useAppStore } from '@/stores/appStore';

defineOptions({
    name: 'TableBundle'
});

const props = defineProps({
    is_loading: Boolean,
    is_lane_drilldown: Boolean,
    is_lane_data: Boolean,
    is_broker_user: Boolean,
    displayed_data: {
        type: Array,
        default: () => []
    },
    original_data: {
        type: Array,
        default: () => []
    },
    has_incomplete_score: {
        type: Boolean,
        default: false
    },
    time_period: [Number, String],
    end_date: [Date, String],
    start_date: [Date, String],
    customer_direct_enabled: Boolean,
    show_agg_tabs: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits([
    'parseURL',
    'laneClick',
    'focusLanes',
    'favoriteLanes'
]);

const appStore = useAppStore();

// Refs for template components
const bar = ref(null);
const table = ref(null);

// Local State
const isLoading = ref(props.is_loading);
const isLaneDrilldown = ref(props.is_lane_drilldown);
const isLaneData = ref(props.is_lane_data);
const isBrokerUser = ref(props.is_broker_user);
const timePeriod = ref(props.time_period);
const endDate = ref(props.end_date);
const startDate = ref(props.start_date);
const isCustomerDirectEnabled = ref(props.customer_direct_enabled);
const hasIncompleteScore = ref(props.has_incomplete_score);

const displayedData = ref(props.displayed_data);
const originalData = ref(props.original_data);

const showSelect = ref(false);
const selectedLanes = ref({});
const isDashboard = ref(null);
const tableType = ref('');
const volumeThreshold = ref(0);

// Table/Bar Specific Data
const isWeeklyView = ref(false);
const isFullView = ref(false);
const headers = ref(null);
const headersShipments = ref(null);
const serverItemsLength = ref(-1);
const serverItemsLengthShipments = ref(-1);
const isTableLoading = ref(false);
const isDropdownLoading = ref(false);

const pageSize = ref(100);
const pageNumber = ref(0);
const sortColumn = ref('volume');
const sortDirection = ref('DESC');

const pageSizeShipments = ref(8);
const pageNumberShipments = ref(0);
const sortColumnShipments = ref('originCloseTime');
const sortDirectionShipments = ref('DESC');

const searchTable = ref(null);

// Watchers to keep local refs in sync with props
watch(() => props.is_loading, (val) => { isLoading.value = val; });
watch(() => props.is_lane_drilldown, (val) => { isLaneDrilldown.value = val; });
watch(() => props.is_lane_data, (val) => { isLaneData.value = val; });
watch(() => props.is_broker_user, (val) => { isBrokerUser.value = val; });
watch(() => props.time_period, (val) => { timePeriod.value = val; });
watch(() => props.end_date, (val) => { endDate.value = val; });
watch(() => props.start_date, (val) => { startDate.value = val; });
watch(() => props.has_incomplete_score, (val) => { hasIncompleteScore.value = val; });

watch(() => props.displayed_data, (val) => {
    displayedData.value = val;
}, { immediate: true });

watch(() => props.original_data, (val) => {
    originalData.value = val;
    handleActiveBrokersOnlyToggle();
}, { immediate: true });

watch(() => props.customer_direct_enabled, (val) => {
    isCustomerDirectEnabled.value = val;
    populateHeaders();
    populateShipmentHeaders();
});

// Initialization
const init = () => {
    const url = new URL(window.location.href);
    isDashboard.value = url.pathname.includes('Dashboard');
    if (isLaneDrilldown.value) {
        isDashboard.value = false;
    }
    if (
        isLaneDrilldown.value ||
        (isDashboard.value && !url.pathname.includes('lane'))
    ) {
        volumeThreshold.value = 0;
        isLaneData.value = false;
        if (isBrokerUser.value) {
            tableType.value = 'Shipper';
        } else {
            tableType.value = 'Broker';
        }
    } else {
        tableType.value = 'Lane';
        isLaneData.value = true;
    }
    populateHeaders();
    populateShipmentHeaders();
};

onBeforeMount(() => {
    init();
});

// Methods
const populateHeaders = () => {
    let newHeaders;
    if (isLaneData.value) {
        newHeaders = isDashboard.value
            ? globalVariables.default.headers_lanes
            : _.cloneDeep(globalVariables.default.headers_lanes_drilldown);
        if (!isDashboard.value && isCustomerDirectEnabled.value) {
            if (!newHeaders.includes(globalVariables.default.customer_direct_header)) {
                newHeaders.splice(5, 0, globalVariables.default.customer_direct_header);
            }
        }
    } else {
        newHeaders = isBrokerUser.value
            ? (isDashboard.value
                ? globalVariables.default.headers_shippers
                : globalVariables.default.headers_shippers_drilldown)
            : (isDashboard.value
                ? globalVariables.default.headers_brokers
                : globalVariables.default.headers_brokers_drilldown);
    }
    if (!isFullView.value) {
        headers.value = filterHeaders(newHeaders);
    } else {
        headers.value = newHeaders;
    }
};

const populateShipmentHeaders = () => {
    if (isWeeklyView.value) {
        headersShipments.value = _.cloneDeep(globalVariables.default.headers_shipments_aggregation);
        if (isCustomerDirectEnabled.value && !headersShipments.value.includes(globalVariables.default.customer_direct_header_shipments)) {
            headersShipments.value.splice(2, 0, globalVariables.default.customer_direct_header_shipments);
        }
    } else {
        headersShipments.value = _.cloneDeep(globalVariables.default.headers_shipments);
        if (isCustomerDirectEnabled.value && !headersShipments.value.includes(globalVariables.default.customer_direct_header_shipments)) {
            headersShipments.value.splice(3, 0, globalVariables.default.customer_direct_header_shipments);
        }
    }
    if (!isFullView.value) {
        headersShipments.value = filterHeaders(headersShipments.value);
    }
};

const filterHeaders = (headersList) => {
    const headers_filtered = [];
    for (const entry of headersList) {
        if (!globalVariables.default.simple_view_header_blacklist.includes(entry.value)) {
            let clone;
            if (entry.text === 'Broker Name') {
                clone = structuredClone(entry);
                clone['width'] = '16%';
                headers_filtered.push(clone);
            } else if (entry.text === 'Origin' || entry.text === 'Destination') {
                clone = structuredClone(entry);
                clone['width'] = '11.5%';
                headers_filtered.push(clone);
            } else {
                headers_filtered.push(entry);
            }
        }
    }
    return headers_filtered;
};

const handleBus = (elem) => {
    showSelect.value = elem.showSelect;
    isTableLoading.value = elem.isTableLoading;
    isDropdownLoading.value = elem.isDropdownLoading;
    isWeeklyView.value = elem.isWeeklyView;
    searchTable.value = elem.searchTable;
};

const handleUpdatedOptions = (options) => {
    isTableLoading.value = true;
    pageSize.value = options.itemsPerPage;
    pageNumber.value = options.page - 1;

    if (options.sortBy && options.sortBy.length > 0) {
        const sortBy = options.sortBy[0];
        sortColumn.value = sortBy.key;
        sortDirection.value = sortBy.order.toUpperCase();
    } else {
        sortColumn.value = 'volume';
        sortDirection.value = 'ASC';
    }

    emit('parseURL', true);
};

const handleUpdatedOptionsShipments = (options) => {
    isDropdownLoading.value = pageNumberShipments.value !== (options.page - 1);
    pageSizeShipments.value = options.itemsPerPage;
    pageNumberShipments.value = options.page - 1;

    if (options.sortBy && options.sortBy.length > 0) {
        isDropdownLoading.value = true;
        const sortBy = options.sortBy[0];
        sortColumnShipments.value = sortBy.key;
        sortDirectionShipments.value = sortBy.order.toUpperCase();
    } else {
        sortColumnShipments.value = 'originCloseTime';
        sortDirectionShipments.value = 'DESC';
    }

    emit('parseURL', true);
};

const handleUpdatedSelection = (options) => {
    if (options.items) {
        const temp = {};
        if (options.value) {
            options.items.forEach((item) => {
                temp[item.laneId] = null;
            });
        }
        selectedLanes.value = temp;
        return;
    }

    const item = options.item;
    const checked = options.value;
    if (!checked) {
        const temp = { ...selectedLanes.value };
        delete temp[item.laneId];
        selectedLanes.value = temp;
    } else {
        selectedLanes.value = { ...selectedLanes.value, [item.laneId]: null };
    }
};

const handleLaneClick = (event) => {
    emit('laneClick', event);
};

const toggleFullView = (val) => {
    isFullView.value = val;
    populateHeaders();
    populateShipmentHeaders();
};

const toggleAggregate = (val) => {
    if (bar.value) {
        bar.value.isDropdownLoading = true;
    }
    isWeeklyView.value = val;
    populateShipmentHeaders();
    emit('parseURL', true);
};

const handleFocusLanes = (val) => {
    emit('focusLanes', val);
};

const handleFavoriteLanes = (val) => {
    emit('favoriteLanes', val);
};

const handleActiveBrokersOnlyToggle = () => {
    if (!isBrokerUser.value && !isLaneData.value) {
        if (bar.value?.showActiveBrokersOnly) {
            displayedData.value = originalData.value.filter(item => item.active_status === 'active');
        } else {
            displayedData.value = originalData.value;
        }
        serverItemsLength.value = displayedData.value.length;
    }
};

// Expose properties for parent container and utils.js helper
defineExpose({
    isLoading,
    isTableLoading,
    isDropdownLoading,
    displayedData,
    originalData,
    serverItemsLength,
    searchTable,
    pageNumber,
    pageSize,
    sortColumn,
    sortDirection,
    pageNumberShipments,
    pageSizeShipments,
    sortDirectionShipments,
    sortColumnShipments,
    $refs: {
        get bar() { return bar.value; },
        get table() { return table.value; }
    }
});
</script>

<style>
.dataTable {
    background-color: var(--v-dataTableBackground-base) !important;
    color: var(--v-dataTableText-base) !important;
}
</style>