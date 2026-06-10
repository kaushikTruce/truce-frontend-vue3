// The first layer of keys is used to determine the type of graph to be drawn
// toDraw contains objects each corresponding to a single series, with key specifying the name of metric to draw
// |- Keys inside toDraw MUST correspond to value returned inside data queries
//    |-  the dataName field can be used to override this behavior
// |- options inside toDraw objects contain TREND SPECIFIC options. These are pushed into corresponding option arrays
// |- decimals is an optional property for specifying rounding of average values
// |- graph names should be fully lowercase
// graphOptions contains all other graph options, which should apply to the whole graph
import * as format from '../formatShipmentData';

const PAD_RATIO = 0.1;

export default function getConfig(graphType, context) {

    const graphBackground = context.graphBackground

    const graphTheme = context.isDark ? 'dark' : 'light'

    switch (graphType.toLowerCase()) {
        // Metric Trend Graphs
        case 'scpm':
        case 'cpm':
            return {
                toDraw: {
                    'Spend per Mile': {
                        dataName: 'spm',
                        options: {
                            colors: 'rgb(0, 145, 255)',
                            stroke: {
                                width: 2,
                                dashArray: 0
                            }
                        }
                    },
                    'Cost per Mile': {
                        dataName: 'cpm',
                        options: {
                            colors: '#FF6F00',
                            stroke: {
                                width: 2,
                                dashArray: 0
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        type: 'line',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        animations: {
                            enabled: true
                        },
                        background: graphBackground
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: context.getGraphTooltipDate
                        }
                    },
                    stroke: {
                        lineCap: 'round',
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            datetimeFormatter: {
                                month: 'dd MMM'
                            }
                        },
                        convertedCatToNumeric: false
                    },
                    yaxis: {
                        labels: {
                            formatter: function (value) {
                                return format.formatDollars(value, 2, true);
                            }
                        },
                        tickAmount: 4,
                        min: function (min) {
                            return min;
                        },
                        max: function (max) {
                            return max;
                        }
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'left'
                    },
                    theme: {
                        mode: graphTheme
                    }
                },
                height: '220',
                type: 'line'
            };
        case 'mpl':
            return {
                toDraw: {
                    'Margin per Load': {
                        dataName: 'mpl',
                        options: {
                            colors: '#D81B60',
                            stroke: {
                                width: 2,
                                dashArray: 0
                            }
                        }
                    },
                    Average: {
                        dataName: 'avg_metric',
                        decimals: 2,
                        options: {
                            colors: '#1E88E5',
                            stroke: {
                                width: 2,
                                dashArray: 4
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        type: 'line',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        animations: {
                            enabled: true
                        },
                        background: graphBackground
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: context.getGraphTooltipDate
                        }
                    },
                    stroke: {
                        lineCap: 'round',
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            datetimeFormatter: {
                                month: 'dd MMM'
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            formatter: function (value) {
                                return format.formatDollars(value);
                            }
                        },
                        tickAmount: 4,
                        min: function (min) {
                            return min - 1;
                        },
                        max: function (max) {
                            return max + 1;
                        }
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'left'
                    },
                    theme: {
                        mode: graphTheme
                    }
                },
                height: '220',
                type: 'line'
            };
        case 'vol':
        case 'volume':
            return {
                toDraw: {
                    Volume: {
                        options: {
                            colors: '#7E57C2',
                            stroke: {
                                width: 2,
                                dashArray: 0
                            }
                        }
                    },
                    Average: {
                        dataName: 'avg_metric',
                        decimals: 0,
                        options: {
                            colors: '#1E88E5',
                            stroke: {
                                width: 2,
                                dashArray: 4
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        type: 'line',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        animations: {
                            enabled: true
                        },
                        background: graphBackground
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: context.getGraphTooltipDate
                        }
                    },
                    stroke: {
                        lineCap: 'round',
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            datetimeFormatter: {
                                month: 'dd MMM'
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            formatter: function (value) {
                                return value.toFixed(0);
                            }
                        },
                        tickAmount: 4,
                        min: function (min) {
                            return min;
                        },
                        max: function (max) {
                            return max;
                        }
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'left'
                    },
                    theme: {
                        mode: graphTheme
                    }
                },
                height: '220',
                type: 'line'
            };

        // Lane Drilldown Graphs
        case 'costspendline':
            return {
                height: '220',
                type: 'line',
                toDraw: {
                    Spend: {
                        dataName: 'avg_spend',
                        options: {
                            colors: '#1E88E5',
                            markers: {
                                size: 0,
                                colors: '#1E88E5',
                                strokeColors: '#1E88E5'
                            },
                            stroke: {
                                lineCap: 'round',
                                width: 2,
                                curve: 'smooth',
                                dashArray: 0
                            }
                        }
                    },
                    'Truck Cost': {
                        dataName: 'avg_cost',
                        options: {
                            colors: '#FF6F60',
                            markers: {
                                size: 3,
                                colors: '#FF6F00',
                                strokeColors: '#FF6F00'
                            },
                            stroke: {
                                lineCap: 'round',
                                width: 0,
                                curve: 'smooth',
                                dashArray: 0
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        animations: {
                            enabled: false
                        },
                        events: {
                            legendClick: function (_, index, config) {
                                if (context.toggled.length === 0) {
                                    context.toggled.splice(
                                        0,
                                        context.toggled.length,
                                        ...Array(context.series.length).fill(false)
                                    )
                                }
                                context.toggled[index] = context.toggled[
                                    index
                                ]
                                    ? false
                                    : true;
                            },
                            updated: function (_, config) {
                                config.config.chart.animations.enabled = false;
                                for (const [
                                    i,
                                    v
                                ] of context.toggled.entries()) {
                                    if (v) {
                                        context.chartRef?.chart?.hideSeries(
                                            context.series[i].name
                                        );
                                    }
                                }
                                config.config.chart.animations.enabled = true;
                            }
                        },
                        background: graphBackground
                    },
                    dataLabels: {
                        enabled: false
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: context.getGraphTooltipDate
                        }
                    },
                    noData: {
                        text: 'No Data Found in Date Range',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetY: -15,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    stroke: {
                        curve: 'smooth',
                        lineCap: 'round'
                    },
                    xaxis: {
                        type: 'datetime',
                        tickPlacement: 'between',
                        tickAmount: 'dataPoints',
                        labels: {
                            hideOverlappingLabels: true,
                            datetimeFormatter: {
                                month: 'dd MMM'
                            }
                        },
                        convertedCatToNumeric: false
                    },
                    yaxis: {
                        forceNiceScale: false,
                        labels: {
                            formatter: function (value) {
                                return format.formatDollars(value, 0);
                            }
                        },
                        tickAmount: 4,
                        min: function (min) {
                            return Math.floor(min / 10) * 10;
                        },
                        max: function (max) {
                            return Math.ceil(max / 10) * 10;
                        }
                    },
                    fill: {
                        opacity: [1, 1]
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right'
                    },
                    theme: {
                        mode: graphTheme
                    }
                }
            };
        case 'costspendbar':
            return {
                height: '220',
                type: 'bar',
                toDraw: {
                    Spend: {
                        dataName: 'avg_spend',
                        options: {
                            colors: '#1E88E5',
                            stroke: {
                                width: 1
                            }
                        }
                    },
                    Cost: {
                        dataName: 'avg_cost',
                        options: {
                            colors: '#FF6F00',
                            stroke: {
                                width: 1
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        stacked: false,
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        events: {
                            legendClick: function (_, index, config) {
                                if (context.toggled.length === 0) {
                                    context.toggled.splice(
                                        0,
                                        context.toggled.length,
                                        ...Array(context.series.length).fill(false)
                                    )
                                }
                                context.toggled[index] = context.toggled[
                                    index
                                ]
                                    ? false
                                    : true;
                            }
                        },
                        animations: {
                            enabled: false
                        },
                        background: graphBackground
                    },
                    dataLabels: {
                        enabled: false
                    },
                    tooltip: {
                        x: {
                            formatter: function (value) {
                                return context.dayCategoriesFull[value - 1];
                            }
                        }
                    },
                    noData: {
                        text: 'No Data Found in Date Range',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetY: -15,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: '60%'
                        }
                    },
                    xaxis: {
                        tickPlacement: 'on',
                        labels: {
                            formatter: function (value) {
                                return context.dayCategories[value - 1];
                            }
                        }
                    },
                    yaxis: {
                        min: function () {
                            let filteredMin = [];
                            let filteredMax = [];
                            const data = context.series.filter(
                                (_, index) => !context.toggled[index]
                            );
                            for (const arr of data) {
                                filteredMin.push(
                                    Math.min(...arr.data.filter((i) => i !== 0))
                                );
                                filteredMax.push(
                                    Math.max(...arr.data.filter((i) => i !== 0))
                                );
                            }
                            const range =
                                Math.max(...filteredMax) -
                                Math.min(...filteredMin);
                            return Math.min(...filteredMin) - PAD_RATIO * range;
                        },

                        max: function () {
                            let filteredMin = [];
                            let filteredMax = [];
                            const data = context.series.filter(
                                (_, index) => !context.toggled[index]
                            );
                            for (const arr of data) {
                                filteredMin.push(
                                    Math.min(...arr.data.filter((i) => i !== 0))
                                );
                                filteredMax.push(
                                    Math.max(...arr.data.filter((i) => i !== 0))
                                );
                            }
                            const range =
                                Math.max(...filteredMax) -
                                Math.min(...filteredMin);
                            return Math.max(...filteredMax) + PAD_RATIO * range;
                        },
                        axisTicks: {
                            show: true
                        },
                        axisBorder: {
                            show: true
                        },
                        labels: {
                            formatter: function (value) {
                                return format.formatDollars(value, 0);
                            }
                        },
                        tickAmount: 4,
                        forceNiceScale: true
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right',
                        markers: {
                            radius: 12
                        }
                    },
                    grid: {
                        padding: {
                            right: 12,
                            left: 12
                        }
                    },
                    theme: {
                        mode: graphTheme
                    }
                }
            };
        case 'volumeline':
            return {
                height: '220',
                type: 'line',
                toDraw: {
                    volume: {
                        dataName: 'total_volume',
                        options: {
                            colors: '#7E57C2',
                            markers: {
                                size: 0
                            },
                            stroke: {
                                width: 2
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        type: 'line',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        animations: {
                            enabled: false
                        },
                        background: graphBackground
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: context.getGraphTooltipDate
                        }
                    },
                    noData: {
                        text: 'No Data Found in Date Range',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetY: -15,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    markers: {
                        size: [0]
                    },
                    stroke: {
                        lineCap: 'round',
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        tickPlacement: 'between',
                        tickAmount: 'dataPoints',
                        labels: {
                            hideOverlappingLabels: true,
                            datetimeFormatter: {
                                month: 'MMM'
                            }
                        },
                        convertedCatToNumeric: false
                    },
                    yaxis: {
                        labels: {
                            formatter: function (value) {
                                return format.formatDecimal(value, 0);
                            }
                        },
                        min: function (min) {
                            return min;
                        },
                        max: function (max) {
                            return max;
                        }
                    },
                    fill: {
                        opacity: [1]
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right'
                    },
                    theme: {
                        mode: graphTheme
                    }
                }
            };
        case 'volumebar':
            return {
                height: '220',
                type: 'bar',
                toDraw: {
                    Volume: {
                        dataName: 'total_volume',
                        options: {
                            colors: '#7E57C2',
                            stroke: {
                                width: 1
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        stacked: false,
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        animations: {
                            enabled: false
                        },
                        events: {
                            legendClick: function (_, index, config) {
                                if (context.toggled.length === 0) {
                                    context.toggled.splice(
                                        0,
                                        context.toggled.length,
                                        ...Array(context.series.length).fill(false)
                                    )
                                }
                                context.toggled[index] = context.toggled[
                                    index
                                ]
                                    ? false
                                    : true;
                                if (context.toggled[index] && index === 0) {
                                    context.chartRef?.chart?.updateOptions({
                                        yaxis: [
                                            {},
                                            {
                                                show: true
                                            }
                                        ]
                                    })
                                } else if (index === 0) {
                                    context.chartRef?.chart?.updateOptions({
                                        yaxis: [
                                            {},
                                            {
                                                show: false
                                            }
                                        ]
                                    })
                                }
                            },
                            updated: function (_, config) {
                                config.config.chart.animations.enabled = false;
                                for (const [
                                    i,
                                    v
                                ] of context.toggled.entries()) {
                                    if (v) {
                                        context.chartRef?.chart?.hideSeries(
                                            context.series[i].name
                                        );
                                    }
                                }
                                config.config.chart.animations.enabled = true;
                            }
                        },
                        background: graphBackground
                    },
                    dataLabels: {
                        enabled: false
                    },
                    tooltip: {
                        x: {
                            formatter: function (value) {
                                return context.dayCategoriesFull[value - 1];
                            }
                        }
                    },
                    noData: {
                        text: 'No Data Found in Date Range',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetY: -15,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: '60%'
                        }
                    },
                    xaxis: {
                        tickPlacement: 'on',
                        labels: {
                            formatter: function (value) {
                                return context.dayCategories[value - 1];
                            }
                        }
                    },
                    yaxis: {
                        min: function () {
                            let filteredMin = [];
                            let filteredMax = [];
                            const data = context.series.filter(
                                (_, index) => !context.toggled[index]
                            );
                            for (const arr of data) {
                                filteredMin.push(
                                    Math.min(...arr.data.filter((i) => i !== 0))
                                );
                                filteredMax.push(
                                    Math.max(...arr.data.filter((i) => i !== 0))
                                );
                            }
                            const range =
                                Math.max(...filteredMax) -
                                Math.min(...filteredMin);
                            return Math.max(
                                Math.min(...filteredMin) - PAD_RATIO * range,
                                0
                            );
                        },

                        max: function () {
                            let filteredMin = [];
                            let filteredMax = [];
                            const data = context.series.filter(
                                (_, index) => !context.toggled[index]
                            );
                            for (const arr of data) {
                                filteredMin.push(
                                    Math.min(...arr.data.filter((i) => i !== 0))
                                );
                                filteredMax.push(
                                    Math.max(...arr.data.filter((i) => i !== 0))
                                );
                            }
                            const range =
                                Math.max(...filteredMax) -
                                Math.min(...filteredMin);
                            return Math.max(...filteredMax) + PAD_RATIO * range;
                        },
                        axisTicks: {
                            show: true
                        },
                        axisBorder: {
                            show: true
                        },
                        labels: {
                            formatter: function (value) {
                                return format.formatDecimal(value, 0);
                            },
                            offsetX: -5
                        },
                        forceNiceScale: true
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right',
                        markers: {
                            radius: 12
                        }
                    },
                    grid: {
                        padding: {
                            right: 12,
                            left: 12
                        }
                    },
                    theme: {
                        mode: graphTheme
                    }
                }
            };
        case 'cpmlanecpmnetworkchart':
            return {
                type: 'line',
                toDraw: {
                    'Lane CPM': {
                        dataName: 'avg_cpm',
                        options: {
                            colors: '#FF6F00',
                            markers: {
                                size: 3,
                                colors: '#FF6F00',
                                strokeColors: '#FF6F00'
                            },
                            stroke: {
                                lineCap: 'round',
                                width: 0,
                                curve: 'smooth',
                                dashArray: 0
                            }
                        }
                    },
                    'Network CPM': {
                        dataName: 'avg_network_cpm',
                        options: {
                            colors: '#1E88E5',
                            markers: {
                                size: 0
                            },
                            stroke: {
                                lineCap: 'round',
                                width: 2,
                                curve: 'smooth',
                                dashArray: 0
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        type: 'line',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: false,
                                zoomout: false,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        events: {
                            legendClick: function (_, index, config) {
                                if (context.toggled.length === 0) {
                                    context.toggled.splice(
                                        0,
                                        context.toggled.length,
                                        ...Array(context.series.length).fill(false)
                                    )
                                }
                                context.toggled[index] = context.toggled[
                                    index
                                ]
                                    ? false
                                    : true;
                            },
                            updated: function (_, config) {
                                config.config.chart.animations.enabled = false;
                                for (const [
                                    i,
                                    v
                                ] of context.toggled.entries()) {
                                    if (v) {
                                        context.chartRef?.chart?.hideSeries(
                                            context.series[i].name
                                        );
                                    }
                                }
                                config.config.chart.animations.enabled = true;
                            }
                        },
                        background: graphBackground
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: context.getGraphTooltipDate
                        }
                    },
                    noData: {
                        text: 'No Benchmark Data',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetY: -20,
                        style: {
                            fontSize: '24px'
                        }
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            hideOverlappingLabels: true,
                            datetimeFormatter: {
                                month: 'MMM'
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            formatter: function (value) {
                                return format.formatDollars(value, 2, true);
                            }
                        },
                        tickAmount: 4,
                        min: function (min) {
                            return min;
                        },
                        max: function (max) {
                            return max;
                        }
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right'
                    },
                    theme: {
                        mode: graphTheme
                    }
                }
            };
        case 'ontimechart':
            return {
                height: '220',
                type: 'line',
                toDraw: {
                    OTP: {
                        dataName: 'avg_otp',
                        options: {
                            colors: '#1E88E5',
                            stroke: {
                                width: 2
                            }
                        }
                    },
                    OTD: {
                        dataName: 'avg_otd',
                        options: {
                            colors: '#FF6F00',
                            stroke: {
                                width: 2
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        animations: {
                            enabled: true
                        },
                        events: {
                            legendClick: function (_, index, config) {
                                if (context.toggled.length === 0) {
                                    context.toggled.splice(
                                        0,
                                        context.toggled.length,
                                        ...Array(context.series.length).fill(false)
                                    )
                                }
                                context.toggled[index] = context.toggled[
                                    index
                                ]
                                    ? false
                                    : true;
                            },
                            updated: function (_, config) {
                                config.config.chart.animations.enabled = false;
                                for (const [
                                    i,
                                    v
                                ] of context.toggled.entries()) {
                                    if (v) {
                                        context.chartRef?.chart?.hideSeries(
                                            context.series[i].name
                                        );
                                    }
                                }
                                config.config.chart.animations.enabled = true;
                            }
                        },
                        background: graphBackground
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: context.getGraphTooltipDate
                        },
                        y: {
                            formatter: function (value) {
                                return (value * 100).toFixed(2) + '%';
                            }
                        }
                    },
                    noData: {
                        text: 'No Data Found in Date Range',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetY: -15,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    stroke: {
                        curve: 'smooth',
                        lineCap: 'round'
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            hideOverlappingLabels: true,
                            datetimeFormatter: {
                                month: 'dd MMM'
                            }
                        }
                    },
                    yaxis: {
                        forceNiceScale: false,
                        tickAmount: 4,
                        labels: {
                            formatter: function (value) {
                                return Math.round(value * 100) + '%';
                            }
                        }
                    },
                    fill: {
                        opacity: [1, 1]
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right'
                    },
                    theme: {
                        mode: graphTheme
                    }
                }
            };

        // Analytics Graphs
        case 'mplanalytics':
            return {
                type: 'line',
                toDraw: {
                    'User MPL': {
                        dataName: 'mpl',
                        options: {
                            colors: '#D81B60',
                            stroke: {
                                lineCap: 'round',
                                width: 2,
                                curve: 'smooth',
                                dashArray: 0
                            }
                        }
                    },
                    'Network MPL': {
                        dataName: 'network_mpl',
                        options: {
                            colors: '#1E88E5',
                            stroke: {
                                lineCap: 'round',
                                width: 2,
                                curve: 'smooth',
                                dashArray: 4
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        type: 'line',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        background: graphBackground
                    },
                    noData: {
                        text: 'No Data Found in Date Range',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetY: -15,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: function (value) {
                                var options = {
                                    month: 'short',
                                    day: 'numeric'
                                };
                                var day_ms = 1000 * 60 * 60 * 24;
                                var week_date = new Date(
                                    value + day_ms
                                ).toLocaleDateString('en-us', options);
                                var week_offset_date = new Date(
                                    value + 7 * day_ms
                                ).toLocaleDateString('en-us', options);
                                return week_date + ' - ' + week_offset_date;
                            }
                        }
                    },
                    stroke: {
                        lineCap: 'round',
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            hideOverlappingLabels: true,
                            datetimeFormatter: {
                                month: '01 MMM'
                            }
                        }
                    },
                    yaxis: {
                        forceNiceScale: false,
                        labels: {
                            formatter: function (value) {
                                return format.formatDollars(value, 2);
                            }
                        },
                        tickAmount: 4,
                        min: function (min) {
                            return min;
                        },
                        max: function (max) {
                            return max;
                        }
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right'
                    },
                    theme: {
                        mode: graphTheme
                    }
                }
            };
        case 'spmanalytics':
            return {
                type: 'line',
                toDraw: {
                    'User SPM': {
                        dataName: 'spm',
                        options: {
                            colors: '#2ebf5f',
                            stroke: {
                                lineCap: 'round',
                                width: 2,
                                curve: 'smooth',
                                dashArray: 0
                            }
                        }
                    },
                    'Network SPM': {
                        dataName: 'network_spm',
                        options: {
                            colors: '#1E88E5',
                            stroke: {
                                lineCap: 'round',
                                width: 2,
                                curve: 'smooth',
                                dashArray: 4
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        type: 'line',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        background: graphBackground
                    },
                    noData: {
                        text: 'No Data Found in Date Range',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetY: -15,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: function (value) {
                                var options = {
                                    month: 'short',
                                    day: 'numeric'
                                };
                                var day_ms = 1000 * 60 * 60 * 24;
                                var week_date = new Date(
                                    value + day_ms
                                ).toLocaleDateString('en-us', options);
                                var week_offset_date = new Date(
                                    value + 7 * day_ms
                                ).toLocaleDateString('en-us', options);
                                return week_date + ' - ' + week_offset_date;
                            }
                        }
                    },
                    stroke: {
                        lineCap: 'round',
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            hideOverlappingLabels: true,
                            datetimeFormatter: {
                                month: '01 MMM'
                            }
                        }
                    },
                    yaxis: {
                        forceNiceScale: false,
                        labels: {
                            formatter: function (value) {
                                return format.formatDollars(value, 2, true);
                            }
                        },
                        tickAmount: 4,
                        min: function (min) {
                            return min;
                        },
                        max: function (max) {
                            return max;
                        }
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right'
                    },
                    theme: {
                        mode: graphTheme
                    }
                }
            };
        case 'cpmchart':
            return {
                type: 'line',
                toDraw: {
                    'User CPM': {
                        dataName: 'cpm',
                        options: {
                            colors: '#ff9340',
                            stroke: {
                                lineCap: 'round',
                                width: 2,
                                curve: 'smooth',
                                dashArray: 0
                            }
                        }
                    },
                    'Network CPM': {
                        dataName: 'network_cpm',
                        options: {
                            colors: '#1E88E5',
                            stroke: {
                                lineCap: 'round',
                                width: 2,
                                curve: 'smooth',
                                dashArray: 4
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        type: 'line',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        background: graphBackground
                    },
                    noData: {
                        text: 'No Data Found in Date Range',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetY: -15,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: function (value) {
                                var options = {
                                    month: 'short',
                                    day: 'numeric'
                                };
                                var day_ms = 1000 * 60 * 60 * 24;
                                var week_date = new Date(
                                    value + day_ms
                                ).toLocaleDateString('en-us', options);
                                var week_offset_date = new Date(
                                    value + 7 * day_ms
                                ).toLocaleDateString('en-us', options);
                                return week_date + ' - ' + week_offset_date;
                            }
                        }
                    },
                    stroke: {
                        lineCap: 'round',
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            hideOverlappingLabels: true,
                            datetimeFormatter: {
                                month: '01 MMM'
                            }
                        }
                    },
                    yaxis: {
                        forceNiceScale: false,
                        labels: {
                            formatter: function (value) {
                                return format.formatDollars(value, 2, true);
                            }
                        },
                        tickAmount: 4,
                        min: function (min) {
                            return min;
                        },
                        max: function (max) {
                            return max;
                        }
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right'
                    },
                    theme: {
                        mode: graphTheme
                    }
                }
            };
        case 'pbchart':
            return {
                type: 'line',
                toDraw: {
                    'User Prebook': {
                        dataName: 'prebook_percent',
                        options: {
                            colors: '#FF1744',
                            stroke: {
                                width: 2,
                                dashArray: 0
                            }
                        }
                    },
                    'Network Prebook': {
                        dataName: 'network_prebook_percent',
                        options: {
                            colors: '#1E88E5',
                            stroke: {
                                width: 2,
                                dashArray: 4
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        type: 'line',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        background: graphBackground
                    },
                    noData: {
                        text: 'No Data Found in Date Range',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetY: -15,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: function (value) {
                                var options = {
                                    month: 'short',
                                    day: 'numeric'
                                };
                                var day_ms = 1000 * 60 * 60 * 24;
                                var week_date = new Date(
                                    value + day_ms
                                ).toLocaleDateString('en-us', options);
                                var week_offset_date = new Date(
                                    value + 7 * day_ms
                                ).toLocaleDateString('en-us', options);
                                return week_date + ' - ' + week_offset_date;
                            }
                        }
                    },
                    colors: ['#fea234', '#1E88E5'],
                    stroke: {
                        lineCap: 'round',
                        width: [3, 2],
                        curve: 'smooth',
                        dashArray: [0, 4]
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            hideOverlappingLabels: true,
                            datetimeFormatter: {
                                month: 'MMM'
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            formatter: function (value) {
                                if (isNaN(value)) {
                                    return '--';
                                }
                                return format.formatPercent(value);
                            }
                        },
                        tickAmount: 4,
                        min: function (min) {
                            return min;
                        },
                        max: function (max) {
                            return max;
                        }
                    },
                    fill: {
                        opacity: [1, 0.85]
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right'
                    },
                    theme: {
                        mode: graphTheme
                    }
                }
            };
        case 'cltchart':
            return {
                type: 'line',
                toDraw: {
                    '% CLT < 2 (User)': {
                        dataName: 'cltl1',
                        options: {
                            colors: '#7B1FA2',
                            stroke: {
                                width: 2,
                                dashArray: 0
                            }
                        }
                    },
                    '% CLT < 2 (Network)': {
                        dataName: 'network_cltl1',
                        options: {
                            colors: '#1E88E5',
                            stroke: {
                                width: 2,
                                dashArray: 4
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        type: 'line',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        background: graphBackground
                    },
                    noData: {
                        text: 'No Data Found in Date Range',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetY: -15,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: function (value) {
                                var options = {
                                    month: 'short',
                                    day: 'numeric'
                                };
                                var day_ms = 1000 * 60 * 60 * 24;
                                var week_date = new Date(
                                    value + day_ms
                                ).toLocaleDateString('en-us', options);
                                var week_offset_date = new Date(
                                    value + 7 * day_ms
                                ).toLocaleDateString('en-us', options);
                                return week_date + ' - ' + week_offset_date;
                            }
                        }
                    },
                    stroke: {
                        lineCap: 'round',
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            hideOverlappingLabels: true,
                            datetimeFormatter: {
                                month: 'MMM'
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            formatter: function (value) {
                                if (isNaN(value)) {
                                    return '--';
                                }
                                return format.formatPercent(value);
                            }
                        },
                        tickAmount: 4,
                        min: function (min) {
                            return min;
                        },
                        max: function (max) {
                            return max;
                        }
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right'
                    },
                    theme: {
                        mode: graphTheme
                    }
                }
            };
        case 'distancechart':
            return {
                type: 'bar',
                customReader: function (data, dataname, name) {
                    for (const entry of data) {
                        if (entry.distBucket === dataname) {
                            context.series.push({
                                name: name,
                                data: [
                                    format.formatScore(
                                        entry.num_shipments * 100
                                    ),
                                    format.formatScore(
                                        entry.network_num_shipments * 100
                                    )
                                ]
                            });
                        }
                    }
                },
                toDraw: {
                    '0-99 Miles': {
                        dataName: '0-99',
                        options: {
                            colors: '#0091ff'
                        }
                    },
                    '100-249 Miles': {
                        dataName: '100-249',
                        options: {
                            colors: '#00e08c'
                        }
                    },
                    '250-499 Miles': {
                        dataName: '250-499',
                        options: {
                            colors: '#feb019'
                        }
                    },
                    '500-899 Miles': {
                        dataName: '500-899',
                        options: {
                            colors: '#ff4f58'
                        }
                    },
                    '900+ Miles': {
                        dataName: '900+',
                        options: {
                            colors: '#536DFE'
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        type: 'bar',
                        height: 240,
                        stacked: true,
                        stackType: '100%',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        background: graphBackground
                    },
                    dataLabels: {
                        formatter: function (val) {
                            return val < 4 ? '' : `${Math.round(val)}%`;
                        }
                    },
                    noData: {
                        text: 'No Data Found in Date Range',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetY: -15,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            barHeight: '45%'
                        }
                    },
                    stroke: {
                        width: 1,
                        colors: ['#fff']
                    },
                    xaxis: {
                        categories: ['User', 'Network']
                    },
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return (
                                    format.formatPercent(val / 100) +
                                    ' of shipments'
                                );
                            }
                        }
                    },
                    fill: {
                        opacity: 1
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right'
                    },
                    theme: {
                        mode: graphTheme
                    }
                }
            };
        case 'dowvolumebar':
            return {
                type: 'bar',
                customReader: function (data, dataname, name) {
                    let result = [];
                    const daysOfWeek = [
                        'Sun',
                        'Mon',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat'
                    ];
                    const colors = [
                        '#ea8069',
                        '#53afdf',
                        '#cda34a',
                        '#a291e8',
                        '#7fba50',
                        '#e37cc2',
                        '#56bf9b'
                    ];
                    for (const entry of data) {
                        result.push({
                            name: daysOfWeek[entry.day_of_week - 1],
                            data: [entry.volume, entry.network_volume],
                            color: colors[entry.day_of_week - 1]
                        });
                    }
                    context.series.splice(
                        0,
                        context.series.length,
                        ...result
                    )
                },
                toDraw: {
                    userVolume: {
                        dataName: 'userVolume'
                    },
                    networkVolume: {
                        dataName: 'networkVolume'
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        type: 'bar',
                        height: 240,
                        stacked: true,
                        stackType: '100%',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        background: graphBackground
                    },
                    dataLabels: {
                        formatter: function (val) {
                            return val < 4 ? '' : `${Math.round(val)}%`;
                        }
                    },
                    noData: {
                        text: 'No Data Found in Date Range',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetY: -15,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            barHeight: '45%'
                        }
                    },
                    stroke: {
                        width: 1,
                        colors: ['#fff']
                    },
                    xaxis: {
                        categories: ['User', 'Network']
                    },
                    fill: {
                        opacity: 1
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right'
                    },
                    theme: {
                        mode: graphTheme
                    },
                    tooltip: {
                        y: {
                            formatter: function (
                                val,
                                { series, seriesIndex, dataPointIndex, w }
                            ) {
                                let sum = 0;
                                for (const element of series) {
                                    sum += element[dataPointIndex];
                                }
                                return (
                                    format.formatPercent(val / sum) +
                                    ' of shipments'
                                );
                            }
                        }
                    }
                }
            };

        // Scorecard
        case 'scorecardvolume': {
            return {
                type: 'area',
                toDraw: {
                    Volume: {
                        dataName: 'volume',
                        options: {
                            colors: '#F57C00',
                            stroke: {
                                width: 2,
                                dashArray: 0
                            }
                        }
                    }
                },
                graphOptions: {
                    chart: {
                        zoom: {
                            enabled: false
                        },
                        type: 'area',
                        toolbar: {
                            show: false,
                            tools: {
                                download: false,
                                selection: false,
                                zoom: false,
                                zoomin: true,
                                zoomout: true,
                                pan: false,
                                reset: false,
                                customIcons: []
                            }
                        },
                        background: graphBackground
                    },
                    tooltip: {
                        x: {
                            show: true,
                            formatter: function (value) {
                                var options = {
                                    month: 'short',
                                    day: 'numeric'
                                };
                                var day_ms = 1000 * 60 * 60 * 24;
                                var week_date = new Date(
                                    value + day_ms
                                ).toLocaleDateString('en-us', options);
                                return week_date;
                            }
                        }
                    },
                    stroke: {
                        lineCap: 'round',
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            hideOverlappingLabels: true,
                            datetimeFormatter: {
                                month: 'MMM'
                            }
                        }
                    },
                    yaxis: {
                        tickAmount: 4,
                        min: function (min) {
                            return min;
                        },
                        max: function (max) {
                            return max;
                        }
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        horizontalAlign: 'right'
                    },
                    dataLabels: {
                        enabled: false
                    },
                    theme: {
                        mode: graphTheme
                    }
                }
            };
        }
    }
}
