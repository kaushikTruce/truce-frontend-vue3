import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        brokerList: [],
        shipperList: [],
        laneList: [],
        isDarkMode: (() => {
            try {
                const raw = localStorage.getItem('isDarkMode') || localStorage.getItem('darkMode')
                return raw ? JSON.parse(raw) : false
            } catch (e) {
                return false
            }
        })(),
        darkMode: (() => {
            try {
                const raw = localStorage.getItem('darkMode') || localStorage.getItem('isDarkMode')
                return raw ? JSON.parse(raw) : false
            } catch (e) {
                return false
            }
        })(),
        username: (() => {
            try {
                const raw = localStorage.getItem('username')
                return raw ? JSON.parse(raw) : ''
            } catch (e) {
                return ''
            }
        })(),
        email: (() => {
            try {
                const raw = localStorage.getItem('email')
                return raw ? JSON.parse(raw) : ''
            } catch (e) {
                return ''
            }
        })()
    }),

    actions: {
        setStateProperty(property, value) {
            this[property] = value
        },

        setDarkMode(value) {
            this.isDarkMode = value
            this.darkMode = value

            try {
                localStorage.setItem('isDarkMode', JSON.stringify(value))
                localStorage.setItem('darkMode', JSON.stringify(value))
            } catch (e) {
                console.error(e)
            }
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

function normalizeStateArgs(args) {
    if (args.length === 0) {
        return [undefined, undefined]
    }

    // If the first argument is a Vue component or proxy instance (which is an object),
    // we bypass it and extract the actual state property and/or value.
    if (typeof args[0] === 'object' && args[0] !== null) {
        return [args[1], args[2]]
    }

    return [args[0], args[1]]
}

export function setStateProperty(...args) {
    const [property, value] = normalizeStateArgs(args)
    const store = useAppStore()

    store.setStateProperty(property, value)

    try {
        localStorage.setItem(property, JSON.stringify(value))
    } catch (e) {
        console.error(e)
    }
}

export function addToStateList(...args) {
    const [property, value] = normalizeStateArgs(args)
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

export function getStateProperty(...args) {
    const [property] = normalizeStateArgs(args)
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
