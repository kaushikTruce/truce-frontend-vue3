import _ from 'lodash';
import { getCompanyBrokers } from './fetchBrokerManagement';
import * as fetchShipments from './fetchShipments';
import * as globalVariables from './globalVariables';
import { useAppStore } from '@/stores/appStore';

export const EQUIPMENT_TYPE_LIST = globalVariables.default.equipment_type_list;
export const DEFAULT_END_DATE = new Date().toLocaleDateString();
export const DEFAULT_DAYS = 31;
export const DEFAULT_PROJECTION_PERIOD = 30;
export var PROJECTION_PERIOD = 30;

export const REYES_OKTA_URL =
    'https://truce.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=2lesvpgr39vk8nnk27te9rt8ee&redirect_uri=https://www.truce.io/app/brokerDashboard';

export const PROD_URL = 'truce.io';
export const TEST_URL = 'truce-dev.com';
export const DEV_URL = 'localhost';
export const DEMO_URL = 'dev.truce-experimental.com';
export const MIGRATED_URL = 'transparency-migration.d3g3zfgwwmjjk5.amplifyapp.com';

export function isProdEnv() {
    return window.location.href.includes(PROD_URL);
}

export function isDevEnv() {
    return (
        window.location.href.includes(DEV_URL) ||
        window.location.href.includes(TEST_URL) ||
        window.location.href.includes(DEMO_URL) ||
        window.location.href.includes(MIGRATED_URL)
    );
}

export function getCopyrightString() {
    const year = new Date().getFullYear();
    return ` ${year} Truce Tech Inc. All Rights Reserved.`;
}

export function getLocalDate(date) {
    const dateLocal = new Date(date);
    dateLocal.setMinutes(
        dateLocal.getMinutes() + dateLocal.getTimezoneOffset()
    );
    return dateLocal;
}

export function getColor(score) {
    if (
        isNaN(score) ||
        score === undefined ||
        score == null ||
        score === '' ||
        score == '--'
    ) {
        return '#BDBDBD';
    }

    const scoreInt = Number(parseFloat(score).toFixed(0));

    const appStore = useAppStore();
    const isDarkMode = appStore.darkMode || false;

    if (scoreInt > 89) return isDarkMode ? 'rgba(42, 192, 142, 0.75)' : '#2AC08E';
    if (scoreInt > 79) return isDarkMode ? 'rgba(26, 171, 255, 0.8)' : '#1AABFF';
    if (scoreInt > 69) return isDarkMode ? 'rgba(255, 171, 108, 0.75)' : '#FFAB6C';
    if (scoreInt > -1) return isDarkMode ? 'rgba(242, 55, 86, 1)' : '#F23756';
    else return '#BDBDBD';
}

export async function getData(
    component,
    pageType,
    isShipmentTableChange = false
) {
    const appStore = useAppStore();
    // clear query_params
    component.query_params = {};
    component.query_params.is_customer_direct =
        component.isCustomerDirectEnabled ? 1 : 0;
    component.query_params.is_broker_user =
        appStore.role == 'broker' ? 1 : 0;
    var targetName;
    component.query_params.lane_graph_query = 0;
    component.query_params.search_list = appStore.first_load
        ? 1
        : 0;
    component.query_params.mt_query = isShipmentTableChange ? 0 : 1;
    if (component.isBrokerUser) {
        targetName = 'Shipper';
        component.query_params.index_by = 'shipperId';
        component.query_params.brokerId = appStore.user_id;
    } else if (!component.isBrokerUser) {
        targetName = 'Broker';
        component.query_params.index_by = 'brokerId';
        component.query_params.shipperId = appStore.user_id;
    }
    if (pageType == 'drilldown') {
        if (component.isLaneData) {
            // Broker/Shipper Drilldown
            targetName = 'Lane';
            component.query_params.index_by = 'laneId';
            if (component.isBrokerUser) {
                component.query_params.shipperId = appStore.shipper;
            } else if (!component.isBrokerUser) {
                component.query_params.brokerId = appStore.broker;
            }
            component.query_params.focus_lanes = component.focusLanes;
            component.query_params.favorite_lanes = component.favoriteLanes;
        } else {
            // Lane Drilldown
            component.query_params.laneId = appStore.lane;
            component.query_params.lane_graph_query = isShipmentTableChange
                ? 0
                : 1;
            component.query_params.mt_query = 0;
            if (
                component.selectedSB != undefined &&
                component.selectedSB != null &&
                component.selectedSB != ''
            ) {
                component.query_params.selected_sb = component.selectedSB;
            }
            component.query_params.search_list = 1;
        }
    } else if (pageType == 'dashboard') {
        if (component.isLaneData) {
            // Lane Dashboard
            targetName = 'Lane';
            component.query_params.index_by = 'laneId';
            component.query_params.focus_lanes = component.focusLanes;
        } else {
            // Broker/Shipper Dashboard
        }
    } else {
        console.log('Invalid pageType');
    }

    component.query_params.s_query = 1;
    component.query_params.km_query = 1;
    component.query_params.dt_query = 1;
    if (appStore.role == 'admin') {
        component.query_params.df_query = 1;
    } else {
        component.query_params.df_query = 0;
    }
    if (pageType == 'dashboard') {
        component.query_params.is_drilldown = 0;
        component.query_params.lane_graph_query = 0;
    } else if (pageType == 'drilldown') {
        component.query_params.is_drilldown = 1;
    }

    component.query_params.start_date = new Date(
        new Date(component.startDate) - new Date().getTimezoneOffset() * 60000
    )
        .toISOString()
        .substring(0, 10);
    component.query_params.end_date = new Date(
        new Date(component.endDate) - new Date().getTimezoneOffset() * 60000
    )
        .toISOString()
        .substring(0, 10);
    let projection_start_date = new Date(
        new Date(appStore.startDate) -
            new Date().getTimezoneOffset() * 60000
    )
        .toISOString()
        .substring(0, 10);
    component.query_params.projection_start_date = projection_start_date;
    let projection_start_date_30 = new Date(
        new Date(
            new Date(
                new Date(
                    new Date() - DEFAULT_PROJECTION_PERIOD * 1000 * 60 * 60 * 24
                ).setHours(5, 0, 0)
            )
        ) -
            new Date().getTimezoneOffset() * 60000
    )
        .toISOString()
        .substring(0, 10);
    var projectionStartPeriod = (
        (new Date().getTime() - new Date(projection_start_date).getTime()) /
        (24 * 60 * 60 * 1000)
    ).toFixed(0);
    PROJECTION_PERIOD =
        projectionStartPeriod < DEFAULT_PROJECTION_PERIOD
            ? projectionStartPeriod
            : DEFAULT_PROJECTION_PERIOD;
    component.query_params.projection_start_date_30 =
        projectionStartPeriod < DEFAULT_PROJECTION_PERIOD
            ? projection_start_date
            : projection_start_date_30;
    component.query_params.projection_end_date = new Date(
        new Date() - new Date().getTimezoneOffset() * 60000
    )
        .toISOString()
        .substring(0, 10);
    component.query_params.volume_threshold = component.volumeThreshold;
    component.query_params.equipment_type = component.selectedEquipmentTypes;
    component.query_params.metric_trend_type = component.metricTrendType;

    let table_bundle = component.$refs.bundle;
    if (table_bundle) {
        component.query_params.include_accessorials = table_bundle.$refs.bar
            .includeAcc
            ? 1
            : 0;
        component.query_params.agg_by_week = table_bundle.$refs.bar.isWeeklyView
            ? 1
            : 0;
        component.query_params.page_number = table_bundle.pageNumber;
        component.query_params.page_size = table_bundle.pageSize;
        component.query_params.order_by = table_bundle.sortColumn;
        component.query_params.order_by_direction = table_bundle.sortDirection;
        component.query_params.shipment_page_number =
            table_bundle.pageNumberShipments;
        component.query_params.shipment_page_size =
            table_bundle.pageSizeShipments;
        component.query_params.shipment_order_by_direction =
            table_bundle.sortDirectionShipments;
        component.query_params.shipment_order_by =
            table_bundle.sortColumnShipments;
    } else {
        component.query_params.include_accessorials = COGS_REV.WITH_ACC;
        component.query_params.agg_by_week = 0;
        component.query_params.page_number = 0;
        component.query_params.page_size = 100;
        component.query_params.order_by = 'Volume';
        component.query_params.order_by_direction = 'DESC';
        component.query_params.shipment_page_number = 0;
        component.query_params.shipment_page_size = 8;
        component.query_params.shipment_order_by_direction = 'DESC';
        component.query_params.shipment_order_by = 'originCloseTime';
    }

    // Group by week when time period is more that 14 days, else group by date
    component.query_params.is_week_query =
        (
            (new Date(new Date(component.endDate).setHours(5, 0, 0)).getTime() -
                new Date(
                    new Date(component.startDate).setHours(5, 0, 0)
                ).getTime()) /
                (24 * 60 * 60 * 1000) +
            1
        ).toFixed(0) > DEFAULT_DAYS
            ? 1
            : 0;

    if (
        (component.deltaStartDate != null || component.deltaEndDate != null) &&
        component.isComparisonEnabled
    ) {
        component.query_params.delta_start_date = new Date(
            new Date(component.deltaStartDate) -
                new Date().getTimezoneOffset() * 60000
        )
            .toISOString()
            .substring(0, 10);
        component.query_params.delta_end_date = new Date(
            new Date(component.deltaEndDate) -
                new Date().getTimezoneOffset() * 60000
        )
            .toISOString()
            .substring(0, 10);
    }

    if (
        table_bundle &&
        table_bundle.searchTable != '' &&
        table_bundle.searchTable != undefined
    ) {
        component.query_params.is_numeric =
            table_bundle.searchTable.match(/\d+/g);
        component.query_params.dt_search_term = table_bundle.searchTable
            .replace(/^\s+/g, '')
            .replace(/\s+$/g, '')
            .replace(/[^a-zA-Z0-9 ]/g, '');
    }

    component.disableMetricTrendCPM = isShipmentTableChange ? false : true;
    component.disableMetricTrendMPL = isShipmentTableChange ? false : true;
    component.disableMetricTrendVOL = isShipmentTableChange ? false : true;

    if (component.query_params.mt_query === 1) {
        var qp;
        // asyn call to get other metric trends
        const metricTrendTypes = ['CPM', 'MPL', 'VOL'];
        if (metricTrendTypes.includes(component.metricTrendType)) {
            const toPreload = metricTrendTypes.filter(
                (val) => val != component.metricTrendType.toUpperCase()
            );
            qp = _.cloneDeep(component.query_params);
            qp.s_query = 0;
            qp.km_query = 0;
            qp.mt_query = 1;
            qp.dt_query = 0;
            for (const elem of toPreload) {
                qp.metric_trend_type = elem;
                fetchShipments.fetchShipmentData(qp).then((result) => {
                    component[`${elem.toLowerCase()}GraphArray`] = _.cloneDeep(
                        result.drivers
                    );
                    component[
                        `disableMetricTrend${elem.toUpperCase()}`
                    ] = false;
                });
            }
        }
    }
    component.query_params.search_list = 1
    await fetchShipments
        .fetchShipmentData(component.query_params)
        .then(async (result) => {
            if (result.data_freshness) {
                var brokerPrefix = '';
                if (typeof component.query_params.brokerId !== 'undefined') {
                    brokerPrefix = 'Broker specific: ';
                }
                component.dataFreshnessLabel =
                    brokerPrefix +
                    'Time since last ingestion: ' +
                    Math.round(result.data_freshness[0].elapsed / 24 / 60) +
                    'days, ' +
                    Math.round((result.data_freshness[0].elapsed / 60) % 24) +
                    'hours, ' +
                    Math.round(result.data_freshness[0].elapsed % 60) +
                    'minutes ' +
                    ' | Ingestion counts -> day: ' +
                    result.data_freshness[0].day_count +
                    ' / month: ' +
                    result.data_freshness[0]?.month_count +
                    ' = ' +
                    parseFloat(result.data_freshness[0]?.percentage).toFixed(
                        2
                    ) +
                    '%';
            }
            var data = result.data_table;
            if (!component.isBrokerUser && !component.isLaneData && component.isDashboard) {
                try {
                    const allBrokers = await getCompanyBrokers()
                    const dataWithActivationStatus = result.data_table.map(item => {
                        const broker = allBrokers.find(b => b.id === item.brokerId);
                        const isActive = broker && broker.originalStatus &&
                            broker.originalStatus.toLowerCase() === 'active';
                        item["active_status"] = isActive ? 'active' : 'inactive';
                        return item;
                    });
                    data = dataWithActivationStatus;
                } catch (error) {
                    console.error('Error fetching Broker users:', error);
                }
            }
            component.displayedData = data;
            component.originalData = data;
            stopLoadingAnims(component);
            component.$refs.bundle.displayedData = data;
            component.$refs.bundle.originalData = data;
            component.$refs.bundle.serverItemsLength = result.row_count[0].count;
            component.dropdownSBList = [
                {
                    name: 'All',
                    id: null
                }
            ];
            const selectSBObject = (appStore[`${targetName.toLowerCase()}_list`] || [])
                .filter((sb) => sb.id == component.selectedSB);
            if (selectSBObject.length != 0) {
                component.dropdownSBList.push(selectSBObject[0]);
            }

            if (
                pageType == 'drilldown' &&
                result.data_table != null &&
                (component.query_params.index_by == 'brokerId' ||
                    component.query_params.index_by == 'shipperId')
            ) {
                result.search_list_brokers.forEach((sb) => {
                    if (
                        !component.dropdownSBList
                            .flatMap((dSB) => dSB.id)
                            .includes(sb[component.query_params.index_by])
                    ) {
                        component.dropdownSBList.push({
                            name: sb.broker_name,
                            id: sb[component.query_params.index_by]
                        });
                    }
                });
            }
            component.averageScore = result.score[0]['score'];
            component.hasIncompleteScore =
                result.score[0]['broker_score'] == null ||
                result.score[0]['carrier_score'] == null;

            let keyMetrics = result.key_metrics[0];
            let keyMetricsProjections = result.key_metrics[1];
            let keyMetricsProjections30 = result.key_metrics[2];
            component.keyMetrics = Object.assign(
                keyMetrics,
                formatKeyMetricProjectionNames(keyMetricsProjections),
                formatKeyMetricProjectionNames(keyMetricsProjections30, true)
            );
            if (result.key_metrics.length == 4) {
                component.keyMetricDeltas = result.key_metrics[3];
            }
            if (typeof qp !== 'undefined') {
                component.metricTrends = result.drivers;
                if (component.metricTrendType == 'CPM') {
                    component.cpmGraphArray = _.cloneDeep(result.drivers);
                    component.disableMetricTrendCPM = false;
                } else if (component.metricTrendType == 'MPL') {
                    component.mplGraphArray = _.cloneDeep(result.drivers);
                    component.disableMetricTrendMPL = false;
                } else if (component.metricTrendType == 'VOL') {
                    component.volGraphArray = _.cloneDeep(result.drivers);
                    component.disableMetricTrendVOL = false;
                }
            } else if (!isShipmentTableChange) {
                let lane_graph_data = result.lane_graphs;
                let lane_graph_bar_data = result.lane_graphs_bar;
                let lane_graph_cpm_data = result.lane_graphs_cpm;
                let lane_graph_otpd_data = result.lane_graphs_otpd;

                component.costSpendVolumeData =
                    lane_graph_data.length == 0 ? null : lane_graph_data;
                component.costVolumeBarData =
                    lane_graph_bar_data.length == 0
                        ? null
                        : lane_graph_bar_data;
                component.cpmLaneCpmNetworkData =
                    lane_graph_cpm_data.length == 0
                        ? null
                        : lane_graph_cpm_data;
                component.onTimeGraphData =
                    lane_graph_otpd_data.length == 0
                        ? null
                        : lane_graph_otpd_data;
            }

            if (pageType == 'dashboard') {
                var newDataList = [];
                var newLaneList = [];
                if (appStore.first_load || result.search_list_brokers.length) {
                    for (
                        var i = 0;
                        i < result.search_list_brokers.length;
                        i++
                    ) {
                        newDataList.push({
                            name: result.search_list_brokers[i].broker_name,
                            group: targetName,
                            id: result.search_list_brokers[i][
                                component.query_params.index_by
                            ],
                            maxIngestionTime:
                                result.search_list_brokers[i].max_ingestion_time
                        });
                    }
                    if (targetName.toLowerCase() === 'broker') {
                        appStore.brokerList = newDataList;
                    } else if (targetName.toLowerCase() === 'shipper') {
                        appStore.shipperList = newDataList;
                    }

                    for (var j = 0; j < result.search_list_lanes.length; j++) {
                        newLaneList.push({
                            name: result.search_list_lanes[j].name,
                            group: 'Lane',
                            id: result.search_list_lanes[j].laneId,
                            equipmenttype:
                                result.search_list_lanes[j].equipmenttype
                        });
                    }
                    appStore.laneList = newLaneList;
                    appStore.setFirstLoad(false);
                }
            }
        });

    component.isTableLoading = false;
    component.isDropdownLoading = false;
}

/**
 * Stops all loading animations controlled by the contained properties
 *
 * @param {*} component
 */
function stopLoadingAnims(component) {
    component.isLoading = false;
    if (component.$refs.bundle?.isLoading) {
        component.$refs.bundle.isLoading = false;
    }
    if (component.$refs.bundle?.isTableLoading) {
        component.$refs.bundle.isTableLoading = false;
    }
    if (component.$refs.bundle?.isDropdownLoading) {
        component.$refs.bundle.isDropdownLoading = false;
    }
}

export function getIndex(isBrokerUser, isLaneDrilldown) {
    if (!isLaneDrilldown) {
        return 'laneId';
    } else if (isLaneDrilldown && !isBrokerUser) {
        return 'brokerId';
    } else if (isLaneDrilldown && isBrokerUser) {
        return 'shipperId';
    }
}

export const COGS_REV = {
    WITHOUT_ACC: 0,
    WITH_ACC: 1
};

/**
 * Separate start and end dates with a hyphen for displaying
 *
 * @param {*} start (start date)
 * @param {*} end (end date)
 * @param {*} component
 */
export function formatDates(start, end, timePeriod, component) {
    var startLocal = new Date(start).toLocaleDateString();
    var endLocal = new Date(end).toLocaleDateString();
    component.periodDates = component.isPeriodOneDay
        ? endLocal
        : startLocal + '—' + endLocal;
    if (timePeriod != null) {
        component.isPeriodNull = false;
        const periodOld = parseInt(timePeriod);
        const endOld = new Date(
            new Date(end).getTime() - periodOld * 1000 * 60 * 60 * 24
        ).toLocaleDateString();
        const startOld = new Date(
            new Date(endOld).getTime() - (periodOld - 1) * 1000 * 60 * 60 * 24
        ).toLocaleDateString();
        component.oldPeriodDates = component.isPeriodOneDay
            ? startOld
            : startOld + '—' + endOld;
    }
}

/**
 * updates filter chips with new values passed
 *
 * @param {String} objtype (type of filter)
 * @param {String} header (header for the filter chip)
 * @param {Array} updateValues (array of values for which to add to chips)
 * @param {Map} filterChips (existing filter chips map)
 * @returns
 */
export function updateFilterChips(objtype, header, updateValues, filterChips) {
    for (var i = 0; i < updateValues.length; i++) {
        filterChips.set(objtype, header + updateValues[i]);
    }
    return filterChips;
}

/**
 * Resets filters when a filter chip is deleted
 *
 * @param {String} objType (type of filter)
 * @param {Date} date (date selected in filter menu)
 * @param {Number} timePeriod (index of period selected in filter menu)
 * @param {Array} tickLabels (array of period options)
 * @param {Map} filterChips (map of chips being displayed that show filters currently applied)
 * @param {Array} originalData
 * @param {Boolean} isLaneDrilldown (if true then in Lane Drilldown page. isLaneDrilldown = !isLaneData)
 * @param {Number} volumeThreshold (indicates the lower bound for volume)
 * @param {*} component
 * @returns
 */
export function resetFilters(
    objType,
    date,
    timePeriod,
    tickLabels,
    filterChips,
    volumeThreshold,
    isCustomerDirectEnabled,
    component
) {
    const appStore = useAppStore();
    // delete chip that was removed from filterChips
    filterChips.delete(objType);

    var period;
    var dateLocal = getLocalDate(date);
    var end = new Date(dateLocal);
    var start;
    var ret;
    var selectedEquipmentTypes;

    // create filters dict if undefined
    if (component.filters == undefined) {
        component.filters = {};
    }

    if (objType == 'dateRange') {
        end = new Date();
        start = new Date(appStore.startDate);
        component.startDate = new Date(start.setHours(5, 0, 0));
        component.endDate = new Date(end.setHours(5, 0, 0));
        timePeriod = (
            (new Date(end).getTime() - new Date(start).getTime()) /
            (24 * 60 * 60 * 1000)
        ).toFixed(0);
        formatDates(
            start.toLocaleDateString(),
            end.toLocaleDateString(),
            timePeriod,
            component
        );
        component.isPeriodOneDay = false;
        selectedEquipmentTypes = resetEquipmentTypeChips('', filterChips);
        // reset filter variable
        component.filters.dates = null;
        component.filters.timeSlider = 5;
        component.deltaEndDate = new Date(
            new Date(
                component.endDate.getTime() -
                    parseInt(timePeriod) * 1000 * 60 * 60 * 24
            ).setHours(5, 0, 0)
        );

        component.deltaStartDate = new Date(
            new Date(
                component.deltaEndDate.getTime() -
                    timePeriod * 1000 * 60 * 60 * 24
            ).setHours(5, 0, 0)
        );
        component.isComparisonEnabled = false;
        component.keyMetricsToggle = null;
        appStore.storeEndDate = new Date();
        appStore.storeDates = null;
        appStore.storeTimePeriod = timePeriod;
        appStore.storeIsComparisonEnabled = false;
        appStore.storeKeyMetricsToggle = null;
    } else if (objType.includes('equipment')) {
        ret = objType.split('_')[1];
        selectedEquipmentTypes = resetEquipmentTypeChips(ret, filterChips);
        component.endDate = date;
        component.filters.equipment = appStore.equipment_type_list;
    } else if (objType == 'volumeThreshold') {
        volumeThreshold = 0;
        selectedEquipmentTypes = resetEquipmentTypeChips('', filterChips);
        component.endDate = date;
        component.filters.volume = 0;
        appStore.storeVolumeThreshold = 0;
    } else if (objType == 'isCustomerDirectEnabled') {
        isCustomerDirectEnabled = false;
        selectedEquipmentTypes = resetEquipmentTypeChips('', filterChips);
        component.endDate = date;
        component.filters.volume = 0;
        appStore.storeIsCustomerDirectEnabled = false;
    }

    // if (filterChips.size == 1 && filterChips.has('enddate')) {
    //     timePeriod = null;
    // }

    component.timePeriod = timePeriod;
    component.filterChips = filterChips;
    component.volumeThreshold = volumeThreshold;
    component.selectedEquipmentTypes = selectedEquipmentTypes;
    component.isCustomerDirectEnabled = isCustomerDirectEnabled;
}

/**
 * Updates the selected equipment types
 *
 * @param {String} resetString (string that holds value to reset in chips)
 * @param {Map} filterChips (map of chips being displayed that show filters currently applied)
 * @returns
 */
export function resetEquipmentTypeChips(resetString = '', filterChips) {
    var equipmentExists = false;
    // TODO(P2): This should be a Set, pending Vue 3 support.
    var selectedEquipmentTypes = [];

    for (const type of filterChips.keys()) {
        if (type.includes('equipment')) {
            selectedEquipmentTypes.push(type.split('_')[1]);
            equipmentExists = true;
        }
    }

    if (resetString != '') {
        for (var j = 0; j < EQUIPMENT_TYPE_LIST.length; j++) {
            // Don't know why we need the second if, but if we remove it we have "Reefer, Reefer" bug.
            if (
                EQUIPMENT_TYPE_LIST[j] != resetString &&
                !selectedEquipmentTypes.includes(EQUIPMENT_TYPE_LIST[j])
            ) {
                selectedEquipmentTypes.push(EQUIPMENT_TYPE_LIST[j]);
            }
        }
    }
    if (!equipmentExists) {
        selectedEquipmentTypes = EQUIPMENT_TYPE_LIST;
    }

    return selectedEquipmentTypes;
}

export function formatKeyMetricProjectionNames(
    keyMetricProjections,
    is30Day = false
) {
    let prefix = is30Day ? 'proj_30_' : 'proj_';
    let renamedKmProjections = {};
    let keys = Object.keys(keyMetricProjections);
    keys.forEach((key) => {
        renamedKmProjections[prefix + key] = keyMetricProjections[key];
    });

    return renamedKmProjections;
}

export function getAPIBaseURL() {
    var api_base_url = '';
    if (isProdEnv()) {
        api_base_url = 'https://586vpclgg3.execute-api.us-east-1.amazonaws.com/prod';
    } else if (isDevEnv()) {
        api_base_url = 'https://pjegsyr9dc.execute-api.us-east-1.amazonaws.com/dev';
    }
    return api_base_url
}
