export default {
    origin_city_state_list: [],
    destination_city_state_list: [],
    shipper_primary_ref_list: [],
    broker_name_list: [],
    last_visited_broker: null,
    first_broker: {
        name: null
    },
    equipment_type_list: [],
    all_brokers_list: [],
    all_shippers_list: [],
    all_lanes_list: [],

    customer_direct_header: {
        text: 'Customer Name',
        align: 'end',
        value: 'customer_directs'
    },
    customer_direct_header_shipments: {
        text: 'Customer Name',
        align: 'end',
        value: 'customer_direct',
        class: 'shipmentHeaderStyling'
    },

    simple_view_header_blacklist: [
        'avg_clt',
        'avg_blt',
        'avg_prebook',
        'avg_otd',
        'clt',
        'blt',
        'prebook'
    ],

    calc_details_whitelist: [
        'avg_revenue',
        'avg_cogs',
        'avg_margin_dollars',
        'avg_margin',
        'total_margin',
        'volume'
    ],

    headers_lanes: [
        {
            text: 'Origin',
            align: 'end',
            value: 'origin',
            tooltip: 'Shipment Origin.'
        },
        {
            text: 'Destination',
            align: 'end',
            value: 'destination',
            tooltip: 'Shipment Destination.'
        },
        {
            text: 'Score',
            align: 'end',
            value: 'score',
            class: 'pr-5',
            tooltip:
                'Truce Score, based various performance metrics, over the period of selected. Metrics include, but are not limited to, Execution, Cost and Service performance.'
        },
        {
            text: 'Equipment Type',
            align: 'end',
            value: 'equipmenttype',
            tooltip: 'Lane equipment type.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Distance (mi)',
            align: 'end',
            value: 'avg_miles',
            tooltip:
                'Average distance in miles, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Spend ($)',
            align: 'end',
            value: 'avg_revenue',
            tooltip:
                'Average Spend, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Truck Cost ($)',
            align: 'end',
            value: 'avg_cogs',
            tooltip:
                'Average Truck Cost per shipment, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Margin Per Load ($)',
            align: 'end',
            value: 'avg_margin_dollars',
            tooltip:
                'Average margin per shipment, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Margin Per Load (%)',
            align: 'end',
            value: 'avg_margin',
            tooltip:
                'Average margin per shipment over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Total Margin ($)',
            align: 'end',
            value: 'total_margin',
            tooltip:
                'Total margin per lane, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. CLT (Days)',
            align: 'end',
            value: 'avg_clt',
            tooltip:
                'Customer Lead Time (CLT) represents time of Customer tender to Ship Date.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. BLT (Days)',
            align: 'end',
            value: 'avg_blt',
            tooltip:
                'Broker Lead Time (BLT) represents the time the Broker activates the shipment for their internal Carrier Sales team, relative to Ship Date.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Pre-Book (Days)',
            align: 'end',
            value: 'avg_prebook',
            tooltip:
                "Pre-Book represents how long it takes the Broker's Internal Carrier Sales team to secure capacity.",
            class: 'widthWrap'
        },
        {
            text: 'OTD (%)',
            align: 'end',
            value: 'avg_otd',
            tooltip: 'Average On-time delivery (OTD) to the minute.',
            class: 'widthWrap'
        },
        {
            text: 'Volume',
            align: 'end',
            value: 'volume',
            tooltip: 'Total shipment Volume, over the time period selected.'
        },
        { text: '', value: 'data-table-expand', sortable: false }
    ],

    headers_lanes_drilldown: [
        {
            text: '',
            align: 'end',
            value: 'gotoDrilldownIcon',
            sortable: false,
            class: 'goToWidthWrap'
        },
        {
            text: 'Origin',
            align: 'end',
            value: 'origin',
            tooltip: 'Shipment Origin.'
        },
        {
            text: 'Destination',
            align: 'end',
            value: 'destination',
            tooltip: 'Shipment Destination.'
        },
        {
            text: 'Score',
            align: 'end',
            value: 'score',
            class: 'pr-5',
            tooltip:
                'Truce Score, based various performance metrics, over the period of selected. Metrics include, but are not limited to, Execution, Cost and Service performance.'
        },
        {
            text: 'Equipment Type',
            align: 'end',
            value: 'equipmenttype',
            tooltip: 'Lane equipment type.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Distance (mi)',
            align: 'end',
            value: 'avg_miles',
            tooltip:
                'Average distance in miles, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Spend ($)',
            align: 'end',
            value: 'avg_revenue',
            tooltip:
                'Average Spend, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Truck Cost ($)',
            align: 'end',
            value: 'avg_cogs',
            tooltip:
                'Average Truck Cost per shipment, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Margin Per Load ($)',
            align: 'end',
            value: 'avg_margin_dollars',
            tooltip:
                'Average margin per shipment, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Margin Per Load (%)',
            align: 'end',
            value: 'avg_margin',
            tooltip:
                'Average margin per shipment over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Total Margin ($)',
            align: 'end',
            value: 'total_margin',
            tooltip:
                'Total margin per lane, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. CLT (Days)',
            align: 'end',
            value: 'avg_clt',
            tooltip:
                'Customer Lead Time (CLT) represents time of Customer tender to Ship Date.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. BLT (Days)',
            align: 'end',
            value: 'avg_blt',
            tooltip:
                'Broker Lead Time (BLT) represents the time the Broker activates the shipment for their internal Carrier Sales team, relative to Ship Date.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Pre-Book (Days)',
            align: 'end',
            value: 'avg_prebook',
            tooltip:
                "Pre-Book represents how long it takes the Broker's Internal Carrier Sales team to secure capacity.",
            class: 'widthWrap'
        },
        {
            text: 'OTD (%)',
            align: 'end',
            value: 'avg_otd',
            tooltip: 'Average On-time delivery (OTD) to the minute.',
            class: 'widthWrap'
        },
        {
            text: 'Volume',
            align: 'end',
            value: 'volume',
            tooltip: 'Total shipment Volume, over the time period selected.'
        },

        { text: '', value: 'data-table-expand', sortable: false }
    ],

    headers_brokers: [
        {
            text: '',
            align: 'end',
            value: 'max_ingestion_time',
            sortable: false,
            class: 'goToWidthWrap'
        },
        {
            text: 'Broker Name',
            align: 'end',
            value: 'name',
            tooltip: 'Name of broker.'
        },
        {
            text: 'Score',
            align: 'end',
            value: 'score',
            class: 'pr-5',
            tooltip:
                'Truce Score, based various performance metrics, over the period of selected. Metrics include, but are not limited to, Execution, Cost and Service performance.'
        },
        {
            text: 'Avg. Spend ($)',
            align: 'end',
            value: 'avg_revenue',
            tooltip:
                'Average Spend, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Truck Cost ($)',
            align: 'end',
            value: 'avg_cogs',
            tooltip:
                'Average Truck Cost per shipment, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Margin Per Load ($)',
            align: 'end',
            value: 'avg_margin_dollars',
            tooltip:
                'Average margin per shipment, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Margin Per Load (%)',
            align: 'end',
            value: 'avg_margin',
            tooltip:
                'Average margin per shipment over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Total Margin ($)',
            align: 'end',
            value: 'total_margin',
            tooltip:
                'Total margin per broker, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. CLT (Days)',
            align: 'end',
            value: 'avg_clt',
            tooltip:
                'Customer Lead Time (CLT) represents time of Customer tender to Ship Date.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. BLT (Days)',
            align: 'end',
            value: 'avg_blt',
            tooltip:
                'Broker Lead Time (BLT) represents the time the Broker activates the shipment for their internal Carrier Sales team, relative to Ship Date.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Pre-Book (Days)',
            align: 'end',
            value: 'avg_prebook',
            tooltip:
                "Pre-Book represents how long it takes the Broker's Internal Carrier Sales team to secure capacity.",
            class: 'widthWrap'
        },
        {
            text: 'OTD (%)',
            align: 'end',
            value: 'avg_otd',
            tooltip: 'Average On-time delivery (OTD) to the minute.',
            class: 'widthWrap'
        },
        {
            text: 'Volume',
            align: 'end',
            value: 'volume',
            tooltip: 'Total shipment Volume, over the time period selected.'
        },
        { text: '', value: 'data-table-expand', sortable: false }
    ],
    headers_brokers_drilldown: [
        {
            text: '',
            align: 'right',
            value: 'gotoDrilldownIcon',
            sortable: false,
            class: 'goToWidthWrap'
        },
        {
            text: 'Broker Name',
            align: 'end',
            value: 'name',
            tooltip: 'Name of broker.'
        },
        {
            text: 'Score',
            align: 'end',
            value: 'score',
            class: 'pr-5',
            tooltip:
                'Truce Score, based various performance metrics, over the period of selected. Metrics include, but are not limited to, Execution, Cost and Service performance.'
        },
        {
            text: 'Avg. Distance (mi)',
            align: 'end',
            value: 'avg_miles',
            tooltip:
                'Average distance in miles, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Spend ($)',
            align: 'end',
            value: 'avg_revenue',
            tooltip:
                'Average Spend, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Truck Cost ($)',
            align: 'end',
            value: 'avg_cogs',
            tooltip:
                'Average Truck Cost per shipment, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Margin Per Load ($)',
            align: 'end',
            value: 'avg_margin_dollars',
            tooltip:
                'Average margin per shipment, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Margin Per Load (%)',
            align: 'end',
            value: 'avg_margin',
            tooltip:
                'Average margin per shipment over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Total Margin ($)',
            align: 'end',
            value: 'total_margin',
            tooltip:
                'Total margin per broker, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. CLT (Days)',
            align: 'end',
            value: 'avg_clt',
            tooltip:
                'Customer Lead Time (CLT) represents time of Customer tender to Ship Date.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. BLT (Days)',
            align: 'end',
            value: 'avg_blt',
            tooltip:
                'Broker Lead Time (BLT) represents the time the Broker activates the shipment for their internal Carrier Sales team, relative to Ship Date.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Pre-Book (Days)',
            align: 'end',
            value: 'avg_prebook',
            tooltip:
                "Pre-Book represents how long it takes the Broker's Internal Carrier Sales team to secure capacity.",
            class: 'widthWrap'
        },
        {
            text: 'OTD (%)',
            align: 'end',
            value: 'avg_otd',
            tooltip: 'Average On-time delivery (OTD) to the minute.',
            class: 'widthWrap'
        },
        {
            text: 'Volume',
            align: 'end',
            value: 'volume',
            tooltip: 'Total shipment Volume, over the time period selected.'
        },
        { text: '', value: 'data-table-expand', sortable: false }
    ],

    headers_shippers: [
        {
            text: '',
            align: 'end',
            value: 'max_ingestion_time',
            sortable: false,
            class: 'goToWidthWrap'
        },
        {
            text: 'Shipper Name',
            align: 'end',
            value: 'name',
            tooltip: 'Name of shipper.'
        },
        {
            text: 'Score',
            align: 'end',
            value: 'score',
            class: 'pr-5',
            tooltip:
                'Truce Score, based various performance metrics, over the period of selected. Metrics include, but are not limited to, Execution, Cost and Service performance.'
        },
        {
            text: 'Avg. Spend ($)',
            align: 'end',
            value: 'avg_revenue',
            tooltip:
                'Average Spend, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Truck Cost ($)',
            align: 'end',
            value: 'avg_cogs',
            tooltip:
                'Average Truck Cost per shipment, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Margin Per Load ($)',
            align: 'end',
            value: 'avg_margin_dollars',
            tooltip:
                'Average margin per shipment, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Margin Per Load (%)',
            align: 'end',
            value: 'avg_margin',
            tooltip:
                'Average margin per shipment over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Total Margin ($)',
            align: 'end',
            value: 'total_margin',
            tooltip:
                'Total margin per broker, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. CLT (Days)',
            align: 'end',
            value: 'avg_clt',
            tooltip:
                'Customer Lead Time (CLT) represents time of Customer tender to Ship Date.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. BLT (Days)',
            align: 'end',
            value: 'avg_blt',
            tooltip:
                'Broker Lead Time (BLT) represents the time the Broker activates the shipment for their internal Carrier Sales team, relative to Ship Date.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Pre-Book (Days)',
            align: 'end',
            value: 'avg_prebook',
            tooltip:
                "Pre-Book represents how long it takes the Broker's Internal Carrier Sales team to secure capacity.",
            class: 'widthWrap'
        },
        {
            text: 'OTD (%)',
            align: 'end',
            value: 'avg_otd',
            tooltip: 'Average On-time delivery (OTD) to the minute.',
            class: 'widthWrap'
        },
        {
            text: 'Volume',
            align: 'end',
            value: 'volume',
            tooltip: 'Total shipment Volume, over the time period selected.'
        },
        { text: '', value: 'data-table-expand', sortable: false }
    ],

    headers_shippers_drilldown: [
        {
            text: '',
            align: 'right',
            value: 'gotoDrilldownIcon',
            sortable: false,
            class: 'goToWidthWrap'
        },
        {
            text: 'Shipper Name',
            align: 'end',
            value: 'name',
            tooltip: 'Name of shipper.'
        },
        {
            text: 'Score',
            align: 'end',
            value: 'score',
            class: 'pr-5',
            tooltip:
                'Truce Score, based various performance metrics, over the period of selected. Metrics include, but are not limited to, Execution, Cost and Service performance.'
        },
        {
            text: 'Avg. Spend ($)',
            align: 'end',
            value: 'avg_revenue',
            tooltip:
                'Average Spend, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Truck Cost ($)',
            align: 'end',
            value: 'avg_cogs',
            tooltip:
                'Average Truck Cost per shipment, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Margin Per Load ($)',
            align: 'end',
            value: 'avg_margin_dollars',
            tooltip:
                'Average margin per shipment, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Margin Per Load (%)',
            align: 'end',
            value: 'avg_margin',
            tooltip:
                'Average margin per shipment over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Total Margin ($)',
            align: 'end',
            value: 'total_margin',
            tooltip:
                'Total margin per broker, in dollars, over the time period selected.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. CLT (Days)',
            align: 'end',
            value: 'avg_clt',
            tooltip:
                'Customer Lead Time (CLT) represents time of Customer tender to Ship Date.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. BLT (Days)',
            align: 'end',
            value: 'avg_blt',
            tooltip:
                'Broker Lead Time (BLT) represents the time the Broker activates the shipment for their internal Carrier Sales team, relative to Ship Date.',
            class: 'widthWrap'
        },
        {
            text: 'Avg. Pre-Book (Days)',
            align: 'end',
            value: 'avg_prebook',
            tooltip:
                "Pre-Book represents how long it takes the Broker's Internal Carrier Sales team to secure capacity.",
            class: 'widthWrap'
        },
        {
            text: 'OTD (%)',
            align: 'end',
            value: 'avg_otd',
            tooltip: 'Average On-time delivery (OTD) to the minute.',
            class: 'widthWrap'
        },
        {
            text: 'Volume',
            align: 'end',
            value: 'volume',
            tooltip: 'Total shipment Volume, over the time period selected.'
        },
        { text: '', value: 'data-table-expand', sortable: false }
    ],

    headers_shipments: [
        {
            text: 'Shipment',
            align: 'end',
            value: 'shipperPrimaryReference',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Ship Date',
            align: 'end',
            value: 'originCloseTime',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Score',
            align: 'end',
            value: 'score',
            class: 'pr-5 shipmentHeaderStyling'
        },
        {
            text: 'Spend ($)',
            align: 'end',
            value: 'revenue',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Truck Cost ($)',
            align: 'end',
            value: 'cogs',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Margin ($)',
            align: 'end',
            value: 'margin_dollars',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Margin (%)',
            align: 'end',
            value: 'margin',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'CLT (Days)',
            align: 'end',
            value: 'clt',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'BLT (Days)',
            align: 'end',
            value: 'blt',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Pre-Book (Days)',
            align: 'end',
            value: 'prebook',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Minutes Late',
            align: 'end',
            value: 'destinationDelayMinutes',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Distance (mi)',
            align: 'end',
            value: 'miles',
            class: 'shipmentHeaderStyling'
        }
    ],

    headers_shipments_aggregation: [
        {
            text: 'Week',
            align: 'center',
            value: 'week',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Score',
            align: 'end',
            value: 'score',
            class: 'pr-5 shipmentHeaderStyling'
        },
        {
            text: 'Volume',
            align: 'end',
            value: 'volume',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Spend ($)',
            align: 'end',
            value: 'revenue',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Truck Cost ($)',
            align: 'end',
            value: 'cogs',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Margin ($)',
            align: 'end',
            value: 'avg_margin_dollars',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Margin (%)',
            align: 'end',
            value: 'avg_margin',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'CLT (Days)',
            align: 'end',
            value: 'clt',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'BLT (Days)',
            align: 'end',
            value: 'blt',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Pre-Book (Days)',
            align: 'end',
            value: 'prebook',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'OTD',
            align: 'end',
            value: 'avg_otd',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Distance (mi)',
            align: 'end',
            value: 'miles',
            class: 'shipmentHeaderStyling'
        }
    ],

    headers_shipments_broker: [
        {
            text: 'Shipment',
            align: 'end',
            value: 'shipperPrimaryReference',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Ship Date',
            align: 'end',
            value: 'originCloseTime',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Score',
            align: 'end',
            value: 'score',
            class: 'pr-5 shipmentHeaderStyling'
        },
        {
            text: 'Spend ($)',
            align: 'end',
            value: 'revenue',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Truck Cost ($)',
            align: 'end',
            value: 'cogs',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Margin ($)',
            align: 'end',
            value: 'margin_dollars',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Margin (%)',
            align: 'end',
            value: 'margin',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'CLT (Days)',
            align: 'end',
            value: 'clt',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'BLT (Days)',
            align: 'end',
            value: 'blt',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Pre-Book (Days)',
            align: 'end',
            value: 'prebook',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Minutes Late',
            align: 'end',
            value: 'destinationDelayMinutes',
            class: 'shipmentHeaderStyling'
        },
        {
            text: 'Distance (mi)',
            align: 'end',
            value: 'miles',
            class: 'shipmentHeaderStyling'
        }
    ],

    headers_savings_calculator: [
        {
            align: 'start',
            value: 'suggest',
            class: 'widthWrap pa-0',
            cellClass: 'styleA pa-0 cellGrad',
            width: '2%',
            sortable: false
        },
        {
            text: '% Margin/L',
            align: 'end',
            value: 'margin',
            class: 'pl-2 pr-0 widthWrap',
            width: '7%',
            cellClass: 'styleC2',
            sortable: false
        },
        {
            text: '$ Margin/L',
            align: 'end',
            value: 'new_margin',
            class: 'pl-2 pr-0 widthWrap',
            width: '7%',
            cellClass: 'styleC2',
            sortable: false
        },
        {
            text: 'Spend/L All-In',
            align: 'end',
            value: 'new_spend',
            class: 'pl-2 pr-0 widthWrap',
            width: '7%',
            cellClass: 'styleC',
            sortable: false
        },
        {
            text: 'RPM All-In',
            align: 'end',
            value: 'rpm',
            class: 'pl-2 pr-0 widthWrap',
            width: '7%',
            cellClass: 'styleC bolden',
            sortable: false
        },
        {
            text: 'Projected Change',
            align: 'end',
            value: 'projected_savings',
            class: 'pl-2 pr-0 widthWrap',
            width: '7%',
            cellClass: 'styleC bolden',
            sortable: false
        },
        {
            text: 'Projected Volume',
            align: 'end',
            value: 'expected_volume',
            class: 'pl-2 pr-0 widthWrap',
            width: '9%',
            cellClass: 'styleC',
            sortable: false
        },
        {
            divider: true,
            align: 'center',
            class: 'pa-0',
            cellClass: 'styleC',
            sortable: false,
            width: '2%'
        },
        {
            align: 'center',
            class: 'pa-0',
            cellClass: 'styleT',
            sortable: false,
            width: '2%'
        },
        {
            text: 'Origin',
            align: 'start',
            value: 'origin',
            cellClass: 'styleT pr-0',
            width: '8%',
            class: 'pr-0 widthWrap'
        },
        {
            align: 'center',
            class: 'pa-0',
            cellClass: 'styleT',
            sortable: false,
            width: '2%'
        },
        {
            text: 'Destination',
            align: 'start',
            value: 'destination',
            cellClass: 'styleT pl-0 pr-0',
            width: '8%',
            class: 'pr-0 pl-0 widthWrap'
        },
        {
            text: 'Equip. Type',
            align: 'center',
            value: 'equipmenttype',
            cellClass: 'styleT pl-1',
            width: '8%',
            class: 'widthWrap pl-1'
        },
        {
            text: 'Miles',
            align: 'center',
            value: 'avg_miles',
            cellClass: 'styleA',
            class: 'pl-0 widthWrap',
            width: '8%',
            filterable: false
        },
        {
            text: 'Volume',
            align: 'center',
            value: 'volume',
            cellClass: 'styleA',
            class: 'pl-0 widthWrap',
            width: '6%',
            filterable: false
        },
        {
            text: 'Lane Details',
            align: 'end',
            value: 'details',
            class: 'pl-2 pr-0 widthWrap',
            width: '5%',
            sortable: false
        }
    ],

    headers_scorecard: [
        {
            text: 'Carrier Name',
            align: 'start',
            value: 'carrier_name',
            class: 'carrierName',
            width: '25%'
        },
        { text: 'Asset Type', align: 'center', value: 'asset_type' },
        { text: 'Total Spend', align: 'center', value: 'total_spend' },
        { text: 'OTP to final', align: 'center', value: 'avg_otp' },
        { text: 'OTD to final', align: 'center', value: 'avg_otd' },
        { text: 'Del to Plan Date', align: 'center', value: 'avg_otd_plan' },
        { text: 'Volume', align: 'center', value: 'volume' }
    ]
};
