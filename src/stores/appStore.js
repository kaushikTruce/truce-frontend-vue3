import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        // Explicitly declared state properties with default values
        brokerList: [],
        shipperList: [],
        laneList: [],
        darkMode: false,
        username: '',
        email: '',
        role: null,
        user_id: null,
        calc_enabled: false,
        broker: null,
        shipper: null,
        lane: null,
        favoriteLanes: {},
        first_load: true,
        crumbs: [],
        crumbIds: ['dashboard'],
        name: '',
        phone_number: '',
        company: '',
        is_admin: false,
        equipment_type_list: ['Dry Van', 'Reefer', 'Flatbed', 'Power Only', 'Straight Truck'],
        table_settings: null,
        startDate: null,
        endDate: null,
        storeEndDate: null,
        storeDates: null,
        storeTimePeriod: null,
        storeIsComparisonEnabled: null,
        storeKeyMetricsToggle: null,
        storeVolumeThreshold: null,
        storeIsCustomerDirectEnabled: null,
        defaultProjectionDate: `${new Date().getFullYear()}-12-31`,
        storeTimeSlider: 5
    }),

    persist: true,

    actions: {
        setRole(value) {
            this.role = value
        },
        setUserId(value) {
            this.user_id = value
        },
        setCalcEnabled(value) {
            this.calc_enabled = value
        },
        setBroker(value) {
            this.broker = value
        },
        setShipper(value) {
            this.shipper = value
        },
        setLane(value) {
            this.lane = value
        },
        setFavoriteLanes(value) {
            this.favoriteLanes = value
        },
        setFirstLoad(value) {
            this.first_load = value
        },
        setCrumbs(value) {
            this.crumbs = value
        },
        setCrumbIds(value) {
            this.crumbIds = value
        },
        setName(value) {
            this.name = value
        },
        setPhoneNumber(value) {
            this.phone_number = value
        },
        setCompany(value) {
            this.company = value
        },
        setIsAdmin(value) {
            this.is_admin = value
        },
        setEquipmentTypeList(value) {
            this.equipment_type_list = value
        },
        setTableSettings(value) {
            this.table_settings = value
        },
        setStartDate(value) {
            this.startDate = value
        },
        setEndDate(value) {
            this.endDate = value
        },

        // Dark Mode Action
        setDarkMode(value) {
            this.darkMode = value
        },

        // Explicit actions
        clearBrokerList() {
            this.brokerList = []
        },
        clearShipperList() {
            this.shipperList = []
        },
        clearLaneList() {
            this.laneList = []
        }
    }
})
