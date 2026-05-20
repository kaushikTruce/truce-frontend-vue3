import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        brokerList: [],
        shipperList: [],
        laneList: []
    }),

    actions: {
        setStateProperty(property, value) {
            this[property] = value
        },

        addToStateList(property, value) {
            if (!Array.isArray(this[property])) {
                this[property] = []
            }

            this[property].push(value)
        },

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

export function setStateProperty(property, value) {
    const store = useAppStore()

    store.setStateProperty(property, value)

    try {
        localStorage.setItem(property, JSON.stringify(value))
    } catch (e) {
        console.error(e)
    }
}

export function addToStateList(property, value) {
    const store = useAppStore()

    store.addToStateList(property, value)

    try {
        localStorage.setItem(
            property,
            JSON.stringify(store[property])
        )
    } catch (e) {
        console.error(e)
    }
}

export function getStateProperty(property) {
    const store = useAppStore()

    if (property in store) {
        return store[property]
    }

    try {
        const raw = localStorage.getItem(property)

        return raw ? JSON.parse(raw) : null
    } catch (e) {
        return null
    }
}

export function clearBrokerList() {
    const store = useAppStore()

    store.clearBrokerList()

    try {
        localStorage.removeItem('brokerList')
    } catch (e) {
        console.error(e)
    }
}

export function clearShipperList() {
    const store = useAppStore()

    store.clearShipperList()

    try {
        localStorage.removeItem('shipperList')
    } catch (e) {
        console.error(e)
    }
}

export function clearLaneList() {
    const store = useAppStore()

    store.clearLaneList()

    try {
        localStorage.removeItem('laneList')
    } catch (e) {
        console.error(e)
    }
}

export function subscribeMutation(callback) {
    const store = useAppStore()

    return store.$subscribe((mutation, state) => {
        callback(mutation, state)
    })
}