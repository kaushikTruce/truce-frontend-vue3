<template>
    <v-card elevation="0">
        <v-card-title class="text-h5 pt-6">
            Broker Management
        </v-card-title>

        <!-- Search feature -->
        <v-card-text class="pb-0">
            <v-row align="center">
                <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="searchQuery" label="Search brokers by name" prepend-inner-icon="mdi-magnify"
                        clearable variant="outlined" density="compact" hide-details="auto"
                        :class="{ 'search-active': searchQuery }" @input="onSearchInput" @click:clear="clearSearch"
                        ref="searchField"></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-text>
            <v-data-table :headers="brokerHeaders" :items="filteredBrokers" :loading="isLoadingBrokers"
                class="elevation-1 fixed-header-table" :items-per-page="10" fixed-header height="340">
                <template #item.status="{ item }">
                    <v-chip :color="getStatusColor(item.status)" text-color="white" size="small">
                        {{ item.status }}
                    </v-chip>
                </template>

                <!-- Actions Column with Toggle Switch -->
                <template #item.actions="{ item }">
                    <div @click.stop="handleToggleClick(item)">
                        <v-switch :model-value="item.status.toLowerCase() === 'active'" readonly :ripple="false"
                            color="success" density="compact" hide-details="auto" class="mt-0 no-pointer" />
                    </div>
                </template>
            </v-data-table>
        </v-card-text>

        <!-- Toggle Access Confirmation Dialog -->
        <v-dialog v-model="showConfirmationDialog" max-width="400px">
            <v-card>
                <v-card-title class="text-h5">
                    Confirm {{ toggleAction === 'enable' ? 'Enable' : 'Disable' }}
                </v-card-title>
                <v-card-text>
                    <span v-if="selectedBroker">
                        Are you sure you want to {{ toggleAction }} <b>{{ selectedBroker.name }}</b>?
                    </span>
                    <v-textarea v-model="toggleRemarks" label="Remarks" counter="255"
                        :rules="[v => v.length <= 255 || 'Remarks must be at most 255 characters long']"
                        :error-messages="toggleRemarksError" rows="3" variant="outlined" class="mt-3"
                        placeholder="Enter any additional remarks..."></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="cancelToggle">
                        Cancel
                    </v-btn>
                    <v-btn :color="toggleAction === 'enable' ? 'success' : 'warning'" variant="text" @click="confirmToggleBroker"
                        :loading="isTogglingStatus">
                        {{ toggleAction === 'enable' ? 'Enable' : 'Disable' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script setup>

import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import { getCompanyBrokers, toggleBrokerStatus } from '../fetchBrokerManagement';

const emit = defineEmits([
    'show-message',
    'show-snackbar'
])

const searchField = useTemplateRef('searchField');
const brokerHeaders = [
    { title: 'Broker Name', key: 'name' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false }
];
const brokers = ref([]);
const isLoadingBrokers = ref(false);
const isTogglingStatus = ref(false);
const showConfirmationDialog = ref(false);
const selectedBroker = ref(null);
const toggleAction = ref('enable');
const toggleRemarks = ref('');
const toggleRemarksError = ref('');
const searchQuery = ref('');

const filteredBrokers = computed(() => {
    if (!searchQuery.value) {
        return brokers.value;
    }
    const query = searchQuery.value.toLowerCase().trim();
    return brokers.value.filter(broker => broker.name.toLowerCase().includes(query));
})

const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
        case 'active':
            return 'success';
        case 'inactive':
            return 'error';
        default:
            return 'grey';
    }
}

const onSearchInput = () => { }

const clearSearch = () => {
    searchQuery.value = '';
}

const focusSearch = () => {
    searchField.value?.focus()
}

const handleKeydown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        focusSearch();
    }
}

const loadCompanyBrokers = async () => {
    isLoadingBrokers.value = true;
    try {
        const allBrokers = await getCompanyBrokers();
        brokers.value = allBrokers.map(broker => ({
            name: broker.brokerName,
            status: broker.originalStatus.toLowerCase() === 'active' ? 'active' : 'inactive',
            id: broker.id,
            _remarks: broker._remarks
        }));
    } catch (error) {
        console.error('Error loading brokers:', error);
        emit('show-message', `Error loading brokers: ${error.message}`);
    } finally {
        isLoadingBrokers.value = false;
    }
}

const handleToggleClick = (broker) => {
    selectedBroker.value = broker;
    toggleAction.value = broker.status.toLowerCase() === 'active' ? 'disable' : 'enable';
    toggleRemarks.value = '';
    showConfirmationDialog.value = true;
}

const confirmToggleBroker = async () => {
    if (!selectedBroker.value) return;

    if (toggleRemarks.value.length > 255) {
        toggleRemarksError.value = 'Remarks must be at most 255 characters long';
        return;
    }

    try {
        isTogglingStatus.value = true;

        await toggleBrokerStatus(
            selectedBroker.value.id,
            toggleAction.value === 'enable',
            toggleRemarks.value
        );

        // Update local state
        const brokerIndex = brokers.value.findIndex(b => b.id === selectedBroker.value.id);
        if (brokerIndex !== -1) {
            brokers.value[brokerIndex] = {
                ...brokers.value[brokerIndex],
                status: toggleAction.value === 'enable' ? 'active' : 'inactive'
            }
        }

        emit('show-snackbar', {
            message: `Successfully ${toggleAction.value === 'enable' ? 'enabled' : 'disabled'} ${selectedBroker.value.name}`,
            color: 'success'
        });

    } catch (error) {
        console.error(`Error toggling broker status: ${error}`);
        emit('show-snackbar', {
            message: `Failed to update broker status: ${error.message}`,
            color: 'error'
        });
    } finally {
        isTogglingStatus.value = false;
        showConfirmationDialog.value = false;
        toggleRemarks.value = '';
        selectedBroker.value = null;
    }
}

const cancelToggle = () => {
    isTogglingStatus.value = false;
    showConfirmationDialog.value = false;
    toggleRemarks.value = '';
    if (selectedBroker.value){
        toggleAction.value = selectedBroker.value.status === 'active' ? 'enable' : 'disable';
    }
    selectedBroker.value = null;
}

onMounted(() => {
    loadCompanyBrokers();
    window.addEventListener(
        'keydown',
        handleKeydown
    );
});

onBeforeUnmount(() => {
    window.removeEventListener(
        'keydown',
        handleKeydown
    );
});

</script>

<style scoped>
.v-data-table {
    background-color: rgb(var(--v-theme-surface)) !important;
}

.fixed-header-table {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}

.fixed-header-table :deep(.v-table__wrapper) {
    overflow-y: auto;
    max-height: 400px;
}

.fixed-header-table :deep(thead) {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
}

.fixed-header-table :deep(tfoot) {
    position: sticky;
    bottom: 0;
    z-index: 1;
    background-color: #f5f5f5;
    border-top: 1px solid #e0e0e0;
}

.search-active {
    border-color: rgb(var(--v-theme-primary)) !important;
}

.search-active :deep(.v-field) {
    border-color: rgb(var(--v-theme-primary)) !important;
}

.v-text-field.search-active {
    box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
}

.no-pointer {
    pointer-events: none;
}
</style>
