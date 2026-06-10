import * as utils from './utils';
import * as format from './formatShipmentData';
import * as fetchShipments from './fetchShipments';
// import * as stateAPI from './stateAPI';

/**
 * Label to display for date range in key metrics card
 * @param {array} tickLabels (labels from the slider in the filters menu)
 * @param {string} timePeriod (the period selected by the user)
 * @returns
 */
export function keyMetricsTimeLabels(tickLabels, timePeriod) {
    var period = tickLabels[timePeriod];
    if (period == '7') return 'Week of';
    if (period == '30') return 'Month of';
    if (period == '60') return '60 days starting';
    if (period == '90') return '90 days starting';
    if (period == '120') return '120 days starting';
}

/**
 * Calculates the key metrics based on the filters and assigns the proper values to the
 * display array
 * @param {array} key_metrics (array that holds values to display)
 * @param {array} tickLabels  (labels from the slider in the filters menu)
 * @param {string} timePeriod (the period selected by the user)
 * @param {string} date (date selected by user)
 * @param {array} selectedEquipmentTypes (equipment types selected)
 * @param {array} displayedData (array of items being displayed)
 * @param {array} originalData (all data for current shipper)
 * @param {function} filterEquipmentType (function to apply equipment type filter)
 * @param {function} filterTimePeriod (function to apply time period filter)
 * @param {boolean} isLaneData (indicates if the data is not broker/shipper)
 * @param {*} component (reference to the component calling the function, used for state variables)
 */
// TODO - Factor out filterEquipmentType/filterTimePeriod and remove from doc string
export function getKeyMetrics(key_metrics, timePeriod, component) {
    //get data for time period
    //data already in this.displayedData

    //calculate metrics for time period
    // var metrics_curr = getMetrics(displayedData);

    // //get data for past time period
    // var period = timePeriod;
    // var dateLocal = utils.getLocalDate(date);
    // const endOld = new Date(dateLocal);
    // var end = new Date(endOld.getTime() - period * 1000 * 60 * 60 * 24);
    // var start = new Date(
    //     endOld.getTime() - (period - 0.5) * 2 * 1000 * 60 * 60 * 24
    // );

    // start.setHours(0, 0, 0, 0);
    // end.setHours(23, 59, 59, 999);

    // var past_data = filters.filterDataByDate(start, end, originalData);

    // if (selectedEquipmentTypes) {
    //     past_data = filters.filterDataByEquipmentType(selectedEquipmentTypes, past_data)

    // }

    // //calculate new aggregates
    // past_data = fetchShipments.adjustShip(
    //     past_data,
    //     utils.getIndex(component.isBrokerUser, !isBrokerData),
    //     component.startDate,
    //     component.includeAcc
    // );

    // //calculate metrics for past time period
    // var metrics_old = getMetrics(past_data);

    // //calculate key metrics
    // const avg_margin_dollar_delta = metrics_curr[0] - metrics_old[0];
    // const avg_margin_delta = metrics_curr[1] - metrics_old[1];
    // const avg_cogs_delta = metrics_curr[2] - metrics_old[2];
    // const avg_prebook_delta = metrics_curr[3] - metrics_old[3];
    // const tot_volume_delta = metrics_curr[4] - metrics_old[4];
    // const avg_blt_clt = metrics_curr[5] - metrics_old[5];
    // const avg_clt_delta = metrics_curr[6] - metrics_old[6];
    // const tot_margin_delta = metrics_curr[7] - metrics_old[7];
    // const avg_blt_delta = metrics_curr[8] - metrics_old[8];

    var avg_margin_dollar_delta;
    var avg_margin_delta;
    var avg_cogs_delta;
    var avg_prebook_delta;
    var tot_volume_delta;
    var avg_blt_clt;
    var avg_clt_delta;
    var tot_margin_delta;
    var avg_blt_delta;

    avg_margin_dollar_delta =
        parseFloat(component.keyMetrics.avg_margin_dollars) -
        parseFloat(component.keyMetricDeltas.avg_margin_dollars);
    avg_margin_delta =
        parseFloat(component.keyMetrics.avg_margin) -
        parseFloat(component.keyMetricDeltas.avg_margin);
    avg_prebook_delta =
        parseFloat(component.keyMetrics.avg_prebook) -
        parseFloat(component.keyMetricDeltas.avg_prebook);
    tot_volume_delta =
        parseFloat(component.keyMetrics.total_volume) -
        parseFloat(component.keyMetricDeltas.total_volume);
    avg_clt_delta =
        parseFloat(component.keyMetrics.avg_clt) -
        parseFloat(component.keyMetricDeltas.avg_clt);
    tot_margin_delta =
        parseFloat(component.keyMetrics.total_margin) -
        parseFloat(component.keyMetricDeltas.total_margin);
    avg_blt_delta =
        parseFloat(component.keyMetrics.avg_blt) -
        parseFloat(component.keyMetricDeltas.avg_blt);

    //populate key metrics
    var icon_color;
    key_metrics.forEach((item) => {
        if (item.id == 'avg_margin_dollar') {
            item.value = format.formatDollars(
                component.keyMetrics.avg_margin_dollars
            );
            item.change =
                component.keyMetricDeltas.avg_margin_dollars != null &&
                component.keyMetricDeltas.avg_margin_dollars.toFixed(0) == 0
                    ? ''
                    : format.formatDollars(
                          component.keyMetricDeltas.avg_margin_dollars
                      );
            icon_color =
                component.keyMetricDeltas.avg_margin_dollars != null &&
                (component.keyMetricDeltas.avg_margin_dollars == 0 ||
                    item.value == item.change)
                    ? getIconColor(0)
                    : getIconColor(avg_margin_dollar_delta);
            item.icon = timePeriod == null ? '' : icon_color[0];
            item.color = icon_color[1];
        }
        // else if (item.id == "avg_margin") {
        //     item.value = format.formatPercent(metrics_curr[1], 1);
        //     item.change = metrics_old[1] != null && metrics_old[1].toFixed(3) == 0 ? '' : format.formatPercent(metrics_old[1], 1);
        //     icon_color = metrics_old[1] != null && (metrics_old[1] == 0 || item.value == item.change) ? getIconColor(0) : getIconColor(avg_margin_delta.toFixed(3));
        //     item.icon = timePeriod == null ? "" : icon_color[0];
        //     item.color = icon_color[1];
        // } else if (item.id == "avg_cogs") {
        //     item.value = format.formatDollars(metrics_curr[2]);
        //     item.change = metrics_old[2] != null && metrics_old[2].toFixed(0) == 0 ? '' : format.formatDollars(metrics_old[2]);
        //     icon_color = metrics_old[2] != null && (metrics_old[2] == 0 || item.value == item.change) ? getIconColor(0) : getIconColor(avg_cogs_delta);
        //     item.icon = timePeriod == null ? "" : icon_color[0];
        //     item.color = icon_color[1];
        // } else if (item.id == "avg_prebook") {
        //     item.value = format.formatHoursToBusinessDays(metrics_curr[3], 1);
        //     item.change = metrics_old[3] != null && metrics_old[3].toFixed(0) == 0 ? '' : format.formatHoursToBusinessDays(metrics_old[3], 1);
        //     icon_color = metrics_old[3] != null && (metrics_old[3].toFixed(1) == 0 || item.value == item.change) ? getIconColor(0) : getIconColor(avg_prebook_delta);
        //     item.icon = timePeriod == null ? "" : icon_color[0];
        //     item.color = icon_color[1];
        // } else if (item.id == "tot_volume") {
        //     item.value = metrics_curr[4].toFixed(0);
        //     item.change = metrics_old[4] != null && metrics_old[4].toFixed(0) == 0 ? '' : metrics_old[4].toFixed(0);
        //     icon_color = metrics_old[4] != null && (metrics_old[4] == 0 || item.value == item.change) ? getIconColor(0) : getIconColor(tot_volume_delta);
        //     item.icon = timePeriod == null ? "" : icon_color[0];
        //     item.color = icon_color[1];
        // } else if (item.id == "avg_blt_clt") {
        //     item.value = format.formatPercent(metrics_curr[5]);
        //     item.change = metrics_old[5] != null && metrics_old[5].toFixed(2) == 0 ? '' : format.formatPercent(metrics_old[5]);
        //     icon_color = metrics_old[5] != null && (metrics_old[5] == 0 || item.value == item.change) ? getIconColor(0) : getIconColor(avg_blt_clt.toFixed(2));
        //     item.icon = timePeriod == null ? "" : icon_color[0];
        //     item.color = icon_color[1];
        // } else if (item.id == "avg_clt") {
        //     item.value = format.formatHoursToBusinessDays(metrics_curr[6], 1);
        //     item.change = metrics_old[6] != null && metrics_old[6].toFixed(0) == 0 ? '' : format.formatHoursToBusinessDays(metrics_old[6], 1);
        //     icon_color = metrics_old[6] != null && (metrics_old[6] == 0 || item.value == item.change) ? getIconColor(0) : getIconColor(avg_clt_delta);
        //     item.icon = timePeriod == null ? "" : icon_color[0];
        //     item.color = icon_color[1];
        // } else if (item.id == "tot_margin") {
        //     item.value = format.formatDollars(metrics_curr[7]);
        //     item.change = metrics_old[7] != null && metrics_old[7].toFixed(0) == 0 ? '' : format.formatDollars(metrics_old[7]);
        //     icon_color = metrics_old[7] != null && (metrics_old[7] == 0 || item.value == item.change) ? getIconColor(0) : getIconColor(tot_margin_delta);
        //     item.icon = timePeriod == null ? "" : icon_color[0];
        //     item.color = icon_color[1];
        // } else if (item.id == "avg_blt") {
        //     item.value = format.formatHoursToBusinessDays(metrics_curr[8], 1);
        //     item.change = metrics_old[8] != null && metrics_old[8].toFixed(0) == 0 ? '' : format.formatHoursToBusinessDays(metrics_old[8], 1);
        //     icon_color = metrics_old[8] != null && (metrics_old[8] == 0 || item.value == item.change) ? getIconColor(0) : getIconColor(avg_blt_delta);
        //     item.icon = timePeriod == null ? "" : icon_color[0];
        //     item.color = icon_color[1];
        // }
    });
}

/**
 * Assigns icon and arrow for specified metric
 * @param {number} metric (metric from key metrics)
 * @returns
 */
export function getIconColor(metric, isComparing = false) {
    if (metric > 0) {
        return ['mdi-arrow-up', '#0091ff'];
    } else if (metric < 0) {
        return ['mdi-arrow-down', '#0091ff'];
    } else if (metric == 0) {
        return ['mdi-minus', '#0091ff'];
    } else {
        return ['', '#0091ff'];
    }
}

export function getIconColorTabs(metric, isComparing = false) {
    if (metric > 0) {
        return ['mdi-trending-up', '#0091ff'];
    } else if (metric < 0) {
        return ['mdi-trending-down', '#0091ff'];
    } else if (metric == 0) {
        return ['mdi-minus', '#0091ff'];
    } else {
        return ['', '#0091ff'];
    }
}

export function getIconColorProjections(metric, isComparing = false) {
    if (metric > 0) {
        return ['mdi-trending-up', 'projection'];
    } else if (metric < 0) {
        return ['mdi-trending-down', 'projection'];
    } else if (metric == 0) {
        return ['mdi-minus', 'projection'];
    } else {
        return ['', 'projection'];
    }
}

/**
 * Calculates averages for key metrics
 * @param {array} data (array of data on which to calculate metrics)
 * @returns
 */
export function getMetrics(data) {
    var avg_margin_dollar = 0;
    var avg_margin = 0;
    var avg_cogs = 0;
    var avg_prebook = 0;
    var tot_volume = 0;
    var avg_blt_clt = 0;
    var avg_revenue = 0;
    var avg_clt = 0;
    var tot_margin = 0;
    var avg_blt = 0;

    data.forEach((item) => {
        if (!item.volume) {
            return;
        }
        console.assert(
            parseFloat(item.volume) == parseFloat(item.shipments.length),
            'Volume is not equal to shipments length'
        );

        const vol = item.volume;
        tot_volume += vol;

        if (item.tot_margin_dollars) {
            avg_margin_dollar += item.tot_margin_dollars;
        }
        if (item.revenue_avg) {
            avg_revenue += item.revenue_avg * vol;
        }
        if (item.cogs_avg) {
            avg_cogs += item.cogs_avg * vol;
        }
        if (item.pre_book) {
            avg_prebook += item.pre_book * vol;
        }
        if (item.blt_clt) {
            avg_blt_clt += item.blt_clt * vol;
        }
        if (item.clt) {
            avg_clt += item.clt * vol;
        }
        if (item.tot_margin_dollars) {
            tot_margin += item.tot_margin_dollars;
        }
        if (item.blt) {
            avg_blt += item.blt * vol;
        }
    });

    if (tot_volume) {
        avg_margin_dollar = avg_margin_dollar / tot_volume;
        avg_margin = (avg_revenue - avg_cogs) / avg_revenue;
        avg_cogs = avg_cogs / tot_volume;
        avg_prebook = avg_prebook / tot_volume;
        avg_blt_clt = avg_blt_clt / tot_volume;
        avg_clt = avg_clt / tot_volume;
        avg_blt = avg_blt / tot_volume;
    }

    return [
        avg_margin_dollar,
        avg_margin,
        avg_cogs,
        avg_prebook,
        tot_volume,
        avg_blt_clt,
        avg_clt,
        tot_margin,
        avg_blt
    ];
}

export function getKeyMetricsForTabs(
    key_metrics,
    showChange,
    component,
    isFilter = false
) {
    var avg_margin_dollar_delta;
    var avg_margin_delta;
    var avg_prebook_delta;
    var tot_volume_delta;
    var avg_clt_delta;
    var tot_margin_delta;
    var avg_blt_delta;
    var tot_spend_delta;
    var avg_spend_delta;
    var avg_otp_delta;
    var avg_otd_delta;
    var prebook_percent_delta;
    var avg_cost_delta;

    // calculate end time before the last 7 days (all data - (date-timeRange))
    if (component.deltaStartDate != null && component.deltaEndDate != null) {
        if (
            component.keyMetricDeltas == null ||
            component.keyMetricDeltas == undefined
        ) {
            avg_margin_dollar_delta = null;
            avg_margin_delta = null;
            avg_prebook_delta = null;
            tot_volume_delta = null;
            avg_clt_delta = null;
            tot_margin_delta = null;
            avg_blt_delta = null;
            tot_spend_delta = null;
            avg_spend_delta = null;
            avg_otp_delta = null;
            avg_otd_delta = null;
            prebook_percent_delta = null;
            avg_cost_delta = null;
        } else {
            avg_margin_dollar_delta =
                component.keyMetrics.avg_margin_dollars == null ||
                component.keyMetricDeltas.avg_margin_dollars == null
                    ? null
                    : parseFloat(component.keyMetrics.avg_margin_dollars) -
                      parseFloat(component.keyMetricDeltas.avg_margin_dollars);
            avg_margin_delta =
                component.keyMetrics.avg_margin == null ||
                component.keyMetricDeltas.avg_margin == null
                    ? null
                    : parseFloat(component.keyMetrics.avg_margin) -
                      parseFloat(component.keyMetricDeltas.avg_margin);
            avg_prebook_delta =
                component.keyMetrics.avg_prebook == null ||
                component.keyMetricDeltas.avg_prebook == null
                    ? null
                    : parseFloat(component.keyMetrics.avg_prebook) -
                      parseFloat(component.keyMetricDeltas.avg_prebook);
            tot_volume_delta =
                component.keyMetrics.total_volume == null ||
                component.keyMetricDeltas.total_volume == null
                    ? null
                    : parseFloat(component.keyMetrics.total_volume) -
                      parseFloat(component.keyMetricDeltas.total_volume);
            avg_clt_delta =
                component.keyMetrics.avg_clt == null ||
                component.keyMetricDeltas.avg_clt == null
                    ? null
                    : parseFloat(component.keyMetrics.avg_clt) -
                      parseFloat(component.keyMetricDeltas.avg_clt);
            tot_margin_delta =
                component.keyMetrics.total_margin == null ||
                component.keyMetricDeltas.total_margin == null
                    ? null
                    : parseFloat(component.keyMetrics.total_margin) -
                      parseFloat(component.keyMetricDeltas.total_margin);
            avg_blt_delta =
                component.keyMetrics.avg_blt == null ||
                component.keyMetricDeltas.avg_blt == null
                    ? null
                    : parseFloat(component.keyMetrics.avg_blt) -
                      parseFloat(component.keyMetricDeltas.avg_blt);
            tot_spend_delta =
                component.keyMetrics.total_spend == null ||
                component.keyMetricDeltas.total_spend == null
                    ? null
                    : parseFloat(component.keyMetrics.total_spend) -
                      parseFloat(component.keyMetricDeltas.total_spend);
            avg_spend_delta =
                component.keyMetrics.avg_spend == null ||
                component.keyMetricDeltas.avg_spend == null
                    ? null
                    : parseFloat(component.keyMetrics.avg_spend) -
                      parseFloat(component.keyMetricDeltas.avg_spend);
            avg_otp_delta =
                component.keyMetrics.avg_otp == null ||
                component.keyMetricDeltas.avg_otp == null
                    ? null
                    : parseFloat(component.keyMetrics.avg_otp) -
                      parseFloat(component.keyMetricDeltas.avg_otp);
            avg_otd_delta =
                component.keyMetrics.avg_otd == null ||
                component.keyMetricDeltas.avg_otd == null
                    ? null
                    : parseFloat(component.keyMetrics.avg_otd) -
                      parseFloat(component.keyMetricDeltas.avg_otd);
            prebook_percent_delta =
                component.keyMetrics.prebook_percent == null ||
                component.keyMetricDeltas.prebook_percent == null
                    ? null
                    : parseFloat(component.keyMetrics.prebook_percent) -
                      parseFloat(component.keyMetricDeltas.prebook_percent);
            avg_cost_delta =
                component.keyMetrics.total_cost == null ||
                component.keyMetricDeltas.total_cost == null ||
                component.keyMetrics.total_volume == null ||
                component.keyMetricDeltas.total_volume == null
                    ? null
                    : parseFloat(
                          component.keyMetrics.total_cost /
                              component.keyMetrics.total_volume
                      ) -
                      parseFloat(
                          component.keyMetricDeltas.total_cost /
                              component.keyMetricDeltas.total_volume
                      );
        }
    }

    //populate key metrics
    var icon_color;

    // var projectionPeriod =
    //     Math.ceil(
    //         (new Date(
    //             stateAPI.getStateProperty(component, 'defaultProjectionDate')
    //         ) -
    //             new Date()) /
    //             8.64e7
    //     ) + 1;
    let projectedSpend =
        (component.keyMetrics.proj_30_total_spend / utils.PROJECTION_PERIOD) *
        projectionPeriod;
    let projectedCost =
        (component.keyMetrics.proj_30_total_cost / utils.PROJECTION_PERIOD) *
        projectionPeriod;
    let projectedVolume =
        (component.keyMetrics.proj_30_total_volume / utils.PROJECTION_PERIOD) *
        projectionPeriod;
    let projectedTotalSpend =
        projectedSpend + component.keyMetrics.proj_total_spend;
    let projectedTotalCost =
        projectedCost + component.keyMetrics.proj_total_cost;
    let projectedTotalVolume =
        projectedVolume + parseInt(component.keyMetrics.proj_total_volume);

    key_metrics.forEach((item) => {
        if (item.id == 'avg_margin_dollars') {
            item.value = format.formatDollars(
                component.keyMetrics.avg_margin_dollars
            );
            item.change =
                !showChange ||
                component.keyMetricDeltas.avg_margin_dollars == null ||
                parseFloat(
                    component.keyMetricDeltas.avg_margin_dollars
                ).toFixed(0) == 0
                    ? ''
                    : format.formatDollars(
                          parseFloat(
                              component.keyMetricDeltas.avg_margin_dollars
                          )
                      );
            if (isFilter) {
                icon_color = !showChange
                    ? ''
                    : getIconColor(
                          parseFloat(avg_margin_dollar_delta).toFixed(0)
                      );
            } else {
                icon_color = !showChange
                    ? ''
                    : getIconColorTabs(
                          parseFloat(avg_margin_dollar_delta).toFixed(0)
                      );
            }
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'avg_margin') {
            item.value = format.formatPercent(
                component.keyMetrics.avg_margin,
                1
            );
            item.change =
                !showChange ||
                component.keyMetricDeltas.avg_margin == null ||
                parseFloat(component.keyMetricDeltas.avg_margin).toFixed(3) == 0
                    ? ''
                    : format.formatPercent(
                          parseFloat(component.keyMetricDeltas.avg_margin),
                          1
                      );
            if (isFilter) {
                icon_color = !showChange
                    ? ''
                    : getIconColor(parseFloat(avg_margin_delta).toFixed(3));
            } else {
                icon_color = !showChange
                    ? ''
                    : getIconColorTabs(parseFloat(avg_margin_delta).toFixed(3));
            }
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'avg_prebook') {
            item.value = format.formatHoursToBusinessDays(
                component.keyMetrics.avg_prebook,
                1
            );
            item.change =
                !showChange ||
                component.keyMetricDeltas.avg_prebook == null ||
                parseFloat(component.keyMetricDeltas.avg_prebook).toFixed(0) ==
                    0
                    ? ''
                    : format.formatHoursToBusinessDays(
                          parseFloat(component.keyMetricDeltas.avg_prebook),
                          1
                      );
            if (isFilter) {
                icon_color = !showChange
                    ? ''
                    : getIconColor(parseFloat(avg_prebook_delta).toFixed(0));
            } else {
                icon_color = !showChange
                    ? ''
                    : getIconColorTabs(
                          parseFloat(avg_prebook_delta).toFixed(0)
                      );
            }
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'total_volume') {
            item.value = format.formatNumber(component.keyMetrics.total_volume);
            item.change =
                !showChange ||
                component.keyMetricDeltas.total_volume == null ||
                parseFloat(component.keyMetricDeltas.total_volume).toFixed(0) ==
                    0
                    ? ''
                    : parseFloat(
                          component.keyMetricDeltas.total_volume
                      ).toFixed(0);
            if (isFilter) {
                icon_color = !showChange
                    ? ''
                    : getIconColor(parseFloat(tot_volume_delta).toFixed(0));
            } else {
                icon_color = !showChange
                    ? ''
                    : getIconColorTabs(parseFloat(tot_volume_delta).toFixed(0));
            }
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'avg_clt') {
            item.value = format.formatHoursToBusinessDays(
                component.keyMetrics.avg_clt,
                1
            );
            item.change =
                !showChange ||
                component.keyMetricDeltas.avg_clt == null ||
                parseFloat(component.keyMetricDeltas.avg_clt).toFixed(0) == 0
                    ? ''
                    : format.formatHoursToBusinessDays(
                          parseFloat(component.keyMetricDeltas.avg_clt),
                          1
                      );
            if (isFilter) {
                icon_color = !showChange
                    ? ''
                    : getIconColor(parseFloat(avg_clt_delta).toFixed(0));
            } else {
                icon_color = !showChange
                    ? ''
                    : getIconColorTabs(parseFloat(avg_clt_delta).toFixed(0));
            }
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'total_margin') {
            item.value = format.formatDollars(
                component.keyMetrics.total_margin
            );
            item.change =
                !showChange ||
                component.keyMetricDeltas.total_margin == null ||
                parseFloat(component.keyMetricDeltas.total_margin).toFixed(0) ==
                    0
                    ? ''
                    : format.formatDollars(
                          parseFloat(component.keyMetricDeltas.total_margin)
                      );
            if (isFilter) {
                icon_color = !showChange
                    ? ''
                    : getIconColor(parseFloat(tot_margin_delta).toFixed(0));
            } else {
                icon_color = !showChange
                    ? ''
                    : getIconColorTabs(parseFloat(tot_margin_delta).toFixed(0));
            }
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'avg_blt') {
            item.value = format.formatHoursToBusinessDays(
                component.keyMetrics.avg_blt,
                1
            );
            item.change =
                !showChange ||
                component.keyMetricDeltas.avg_blt == null ||
                parseFloat(component.keyMetricDeltas.avg_blt).toFixed(0) == 0
                    ? ''
                    : format.formatHoursToBusinessDays(
                          parseFloat(component.keyMetricDeltas.avg_blt),
                          1
                      );
            if (isFilter) {
                icon_color = !showChange
                    ? ''
                    : getIconColor(parseFloat(avg_blt_delta).toFixed(0));
            } else {
                icon_color = !showChange
                    ? ''
                    : getIconColorTabs(parseFloat(avg_blt_delta).toFixed(0));
            }
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'total_spend') {
            item.value = format.formatDollars(component.keyMetrics.total_spend);
            item.change =
                !showChange ||
                component.keyMetricDeltas.total_spend == null ||
                parseFloat(component.keyMetricDeltas.total_spend).toFixed(0) ==
                    0
                    ? ''
                    : format.formatDollars(
                          parseFloat(component.keyMetricDeltas.total_spend)
                      );
            if (isFilter) {
                icon_color = !showChange
                    ? ''
                    : getIconColor(parseFloat(tot_spend_delta).toFixed(0));
            } else {
                icon_color = !showChange
                    ? ''
                    : getIconColorTabs(parseFloat(tot_spend_delta).toFixed(0));
            }
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'avg_spend') {
            let avgSpend = component.keyMetrics.avg_spend;
            item.value = format.formatDollars(avgSpend);
            item.change =
                !showChange ||
                component.keyMetricDeltas.avg_spend == null ||
                parseFloat(component.keyMetricDeltas.avg_spend).toFixed(0) == 0
                    ? ''
                    : format.formatDollars(
                          parseFloat(component.keyMetricDeltas.avg_spend)
                      );
            if (isFilter) {
                icon_color = !showChange
                    ? ''
                    : getIconColor(parseFloat(avg_spend_delta).toFixed(0));
            } else {
                icon_color = !showChange
                    ? ''
                    : getIconColorTabs(parseFloat(avg_spend_delta).toFixed(0));
            }
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'avg_cost') {
            let avgCost =
                component.keyMetrics.total_cost /
                component.keyMetrics.total_volume;
            item.value = format.formatDollars(avgCost);
            item.change =
                !showChange ||
                component.keyMetricDeltas.total_cost == null ||
                parseFloat(component.keyMetricDeltas.total_cost).toFixed(0) == 0
                    ? ''
                    : format.formatDollars(
                          parseFloat(
                              component.keyMetricDeltas.total_cost /
                                  component.keyMetricDeltas.total_volume
                          )
                      );
            if (isFilter) {
                icon_color = !showChange
                    ? ''
                    : getIconColor(parseFloat(avg_cost_delta).toFixed(0));
            } else {
                icon_color = !showChange
                    ? ''
                    : getIconColorTabs(parseFloat(avg_cost_delta).toFixed(0));
            }
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'avg_otp') {
            item.value = format.formatPercent(component.keyMetrics.avg_otp, 0);
            item.change =
                !showChange ||
                component.keyMetricDeltas.avg_otp == null ||
                parseFloat(component.keyMetricDeltas.avg_otp).toFixed(3) == 0
                    ? ''
                    : format.formatPercent(
                          parseFloat(component.keyMetricDeltas.avg_otp),
                          0
                      );
            if (isFilter) {
                icon_color = !showChange
                    ? ''
                    : getIconColor(parseFloat(avg_otp_delta).toFixed(3));
            } else {
                icon_color = !showChange
                    ? ''
                    : getIconColorTabs(parseFloat(avg_otp_delta).toFixed(3));
            }
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'avg_otd') {
            item.value = format.formatPercent(component.keyMetrics.avg_otd, 0);
            item.change =
                !showChange ||
                component.keyMetricDeltas.avg_otd == null ||
                parseFloat(component.keyMetricDeltas.avg_otd).toFixed(3) == 0
                    ? ''
                    : format.formatPercent(
                          parseFloat(component.keyMetricDeltas.avg_otd),
                          0
                      );
            if (isFilter) {
                icon_color = !showChange
                    ? ''
                    : getIconColor(parseFloat(avg_otd_delta).toFixed(3));
            } else {
                icon_color = !showChange
                    ? ''
                    : getIconColorTabs(parseFloat(avg_otd_delta).toFixed(3));
            }
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'prebook_percent') {
            item.value = format.formatPercent(
                component.keyMetrics.prebook_percent,
                0
            );
            item.change =
                !showChange ||
                component.keyMetricDeltas.prebook_percent == null ||
                parseFloat(component.keyMetricDeltas.prebook_percent).toFixed(
                    3
                ) == 0
                    ? ''
                    : format.formatPercent(
                          parseFloat(component.keyMetricDeltas.prebook_percent),
                          0
                      );
            if (isFilter) {
                icon_color = !showChange
                    ? ''
                    : getIconColor(
                          parseFloat(prebook_percent_delta).toFixed(3)
                      );
            } else {
                icon_color = !showChange
                    ? ''
                    : getIconColorTabs(
                          parseFloat(prebook_percent_delta).toFixed(3)
                      );
            }
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'proj_avg_margin_dollars') {
            item.value = format.formatDollars(
                (projectedTotalSpend - projectedTotalCost) /
                    projectedTotalVolume
            );
            icon_color = getIconColorProjections(
                parseFloat(
                    (projectedTotalSpend - projectedTotalCost) /
                        projectedTotalVolume -
                        (component.keyMetrics.proj_total_spend -
                            component.keyMetrics.proj_total_cost) /
                            component.keyMetrics.proj_total_volume
                ).toFixed(0)
            );
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'proj_avg_margin') {
            item.value = format.formatPercent(
                (projectedTotalSpend - projectedTotalCost) /
                    projectedTotalSpend,
                1
            );
            icon_color = getIconColorProjections(
                parseFloat(
                    (projectedTotalSpend - projectedTotalCost) /
                        projectedTotalSpend -
                        (component.keyMetrics.proj_total_spend -
                            component.keyMetrics.proj_total_cost) /
                            component.keyMetrics.proj_total_spend
                ).toFixed(3)
            );
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'proj_total_margin') {
            let projectedMargin =
                (component.keyMetrics.proj_30_total_margin /
                    utils.PROJECTION_PERIOD) *
                projectionPeriod;
            item.value = format.formatDollars(
                component.keyMetrics.proj_total_margin + projectedMargin
            );
            icon_color = getIconColorProjections(
                parseFloat(
                    component.keyMetrics.proj_total_margin +
                        projectedMargin -
                        component.keyMetrics.proj_total_margin
                ).toFixed(0)
            );
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'proj_total_spend') {
            item.value = format.formatDollars(projectedTotalSpend);
            icon_color = getIconColorProjections(
                parseFloat(
                    projectedTotalSpend - component.keyMetrics.total_spend
                ).toFixed(0)
            );
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'proj_avg_spend') {
            item.value = format.formatDollars(
                projectedTotalSpend / projectedTotalVolume
            );
            icon_color = getIconColorProjections(
                parseFloat(
                    projectedTotalSpend / projectedTotalVolume -
                        component.keyMetrics.proj_total_spend /
                            component.keyMetrics.proj_total_volume
                ).toFixed(0)
            );
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'proj_avg_cost') {
            item.value = format.formatDollars(
                projectedTotalCost / projectedTotalVolume
            );
            icon_color = getIconColorProjections(
                parseFloat(
                    projectedTotalCost / projectedTotalVolume -
                        component.keyMetrics.proj_total_cost /
                            component.keyMetrics.proj_total_volume
                ).toFixed(0)
            );
            item.icon = icon_color[0];
            item.color = icon_color[1];
        } else if (item.id == 'proj_total_volume') {
            item.value = format.formatNumber(projectedTotalVolume);
            icon_color = getIconColorProjections(
                projectedTotalVolume - component.keyMetrics.proj_total_volume
            );
            item.icon = icon_color[0];
            item.color = icon_color[1];
        }
    });

    return key_metrics;
}
