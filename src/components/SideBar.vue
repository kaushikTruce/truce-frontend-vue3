<template>
    <v-navigation-drawer
        expand-on-hover
        rail
        :rail-width="43"
        class="pt-4"
        :color="sidebarBackground"
    >
        <v-list
            v-model:selected="selected"
            :mandatory="sidebarMandatory"
        >
            <v-list-item
                v-for="item in items"
                :key="item.action"
                :value="item.action"
                @click="menuActionClick(item.action)"
            >
                <template #prepend>
                    <v-icon :color="iconColor">
                        {{ item.icon }}
                    </v-icon>
                </template>
                
                <v-list-item-title>
                    {{ item.text }}
                </v-list-item-title>

            </v-list-item>
        </v-list>
        
        <template #append>
            <v-list
                v-model:selected="selectedEnd"
                :mandatory="!sidebarMandatory"
            >
                <v-list-item
                    v-for="item in itemsEnd"
                    :key="item.action"
                    :value="item.action"
                    @click="menuActionClick(item.action)"
                >
                    <template #prepend>
                        <v-icon :color="iconColor">
                            {{ item.color }}                            
                        </v-icon>
                    </template>

                    <v-list-item-title>
                        {{ item.text }}
                    </v-list-item-title>                    
                </v-list-item>
            </v-list>
        </template>

        <v-dialog
            v-model="exportPopup"
            width="50%"
            scrim="black"
        >
            <Export @exportDialogState="handleExportResult" />
        </v-dialog>
    </v-navigation-drawer>
</template>

<script setup>
import * as stateAPI from '../stateAPI'
import Export from '../components/Export.vue'
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { computed, ref } from 'vue';

const router = useRouter()
const route = useRoute()
const theme = useTheme()

const exportPopup = ref(false)

function filterNav(items) {
    return items.filter(item => item.enabled)
}

const navItems = [
    {
        icon: 'mdi-lan-connect',
        text: 'Broker Dashboard',
        action: 'broker-dashboard',
        enabled:
            stateAPI.getStateProperty('role') === 'admin' ||
            stateAPI.getStateProperty('role') === 'shipper'
    },
    {
        icon: 'mdi-warehouse',
        text: 'Shipper Dashboard',
        action: 'shipper-dashboard',
        enabled:
            stateAPI.getStateProperty('role') === 'broker'
    },
    {
        icon: 'mdi-state-machine',
        text: 'Lanes',
        action: 'lane-dashboard',
        enabled: true
    },
    {
        icon: 'mdi-star',
        text: 'Favorites',
        action: 'favorites',
        enabled: true
    },
    {
        icon: 'mdi-google-analytics',
        text: 'Network Analytics',
        action: 'analytics',
        enabled: true
    },
    {
        icon: '$calcSidebar',
        text: 'Pricing Calculator',
        action: 'calculator',
        enabled: stateAPI.getStateProperty('calc_enabled')
    },
    {
        icon: 'mdi-chart-pie',
        text: 'Scorecarding',
        action: 'scorecard',
        enabled:
            stateAPI.getStateProperty('user_id') ===
            '0647c8dc-165c-44d2-9783-64570403a39e'
    },
    {
        icon: 'mdi-cloud-download-outline',
        text: 'Export',
        action: 'export',
        enabled: true
    }
]

const navEndItems = [
    {
        icon: 'mdi-cog',
        text: 'Settings',
        enabled: true,
        action: 'account'
    }
]

const items = filterNav(navItems)
const itemsEnd = filterNav(navEndItems)

let routeName = route.name === 'drilldown' ? 'broker-dashboard' : route.name

const navModel = items.findIndex(item => item.action === routeName)

const sidebarMandatory = navModel !== -1

const selected = ref(
    navModel !== -1 ? [items[navModel].action] : []
)

const selectedEnd = ref([])

const sidebarBackground = computed(() => {
    const currentTheme = theme.global.current.value
    return currentTheme.colors.sidebarBackground
})

const iconColor = computed(() => {
    const currentTheme = theme.global.current.value
    return currentTheme.colors.iconColor
})

function menuActionClick(action) {
    const validActions = [
        'lane-dashboard',
        'broker-dashboard',
        'shipper-dashboard',
        'analytics',
        'calculator',
        'scorecard',
        'account',
        'favorites',
        'export'
    ]

    console.assert(
        validActions.includes(action),
        `Invalid action: ${action}`
    )

    let params;

    if (action === 'account') {
        params = {
            initPage: true
        }
    } 
    
    if (action === 'export') {
        exportPopup.value = true
        return
    } 

    router.push({
        name: action,
        params
    })

}

function handleExportResult(value) {
    exportPopup.value = value
}

</script>

<style scoped>

.rotate-135 {
    transform: rotate(135deg);
}

</style>