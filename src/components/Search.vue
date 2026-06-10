<template>
    <v-col cols="4" class="pt-0" style="height: 100%; margin-top: 5px">
        <v-autocomplete
            v-model="selected"
            :items="searchData"
            :custom-filter="customFilter"
            :label="isBrokerUser ? 'Search for shipper or lane!' : 'Search for broker or lane!'"
            :bg-color="isDark ? '#212121' : '#42A5F5'"
            item-title="name"
            item-value="id"
            return-object
            multiple
            chips
            rounded
            density="compact"
            variant="solo-filled"
        >
            <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps" :title="undefined">
                    <template #prepend>
                        <v-icon
                            color="headerIcon"
                            class="mr-2"
                        >
                            {{
                                item.raw.group === 'Broker'
                                    ? 'mdi-lan-connect'
                                    : item.raw.group === 'Shipper'
                                    ? 'mdi-warehouse'
                                    : 'mdi-state-machine'
                            }}
                        </v-icon>
                    </template>

                    <v-list-item-title>
                        {{ item.raw.name }}
                    </v-list-item-title>

                    <v-list-item-subtitle
                        v-if="item.raw.group === 'Lane'"
                    >
                        {{ item.raw.equipmenttype }}
                    </v-list-item-subtitle>

                    <v-list-item-subtitle
                        v-else
                    >
                        {{ item.raw.group }}
                    </v-list-item-subtitle>
                </v-list-item>
            </template>
        </v-autocomplete>
    </v-col>
</template>

<script setup>
import {
    ref,
    watch,
    onMounted,
    onUnmounted,
    computed,
} from 'vue';

import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { useAppStore } from '@/stores/appStore';

const appStore = useAppStore();
const router = useRouter();
const { global: vuetifyGlobal } = useTheme();

const isDark = computed(() => vuetifyGlobal.current.value.dark);

const isBrokerUser = computed(
    () => appStore.role === 'broker'
);

const selected = ref([]);
const searchData = ref([]);
const mutationCount = ref(0);

let unsubscribe = null;

watch(selected, (val) => {
    if (!val?.length) return;

    const {
        name,
        group,
        id,
        equipmenttype,
    } = val[0];

    navigate(name, group, id, equipmenttype);
});

watch(searchData, (val) => {
    const url = new URL(window.location.href);

    let pageId = '';

    for (const elem of ['broker', 'shipper', 'lane']) {
        if (url.searchParams.get(elem)) {
            pageId = elem;
            break;
        }
    }

    if (!pageId) return;

    const currentId = appStore[pageId];

    searchData.value = val.filter(
        (item) => item.id !== currentId
    );
});

function navigate(name, type, id, equipmentType) {
    if (type === 'Broker') {
        appStore.setBroker(id);

        router.push({
            name: 'drilldown',
            query: {
                broker: name.replace(/ /g, '_'),
            },
        });
    } else if (type === 'Shipper') {
        appStore.setShipper(id);

        router.push({
            name: 'drilldown',
            query: {
                shipper: name.replace(/ /g, '_'),
            },
        });
    } else {
        appStore.setLane(id);

        const [originPart, destPart] =
            name.split('-->');

        const origin =
            `${originPart.split(',')[0]}, ${originPart.split(',')[1]}`;

        const destination =
            `${destPart.split(',')[0]}, ${destPart.split(',')[1]}`;

        router.push({
            name: 'lanedrilldown',
            query: {
                lane:
                    `${origin.replace(/ /g, '_')} -> ` +
                    `${destination.replace(/ /g, '_')}`,
                equipment_type: equipmentType,
            },
        });
    }
}

function populate(mutationProperty, value) {
    if (!value) return;

    if (mutationProperty === 'brokerList') {
        if (
            !searchData.value.some(
                (i) => i.header === 'Brokers'
            )
        ) {
            searchData.value = [
                { header: 'Brokers' },
                ...value,
                ...searchData.value,
            ];

            mutationCount.value++;
        }
    } else if (
        mutationProperty === 'shipperList'
    ) {
        if (
            !searchData.value.some(
                (i) => i.header === 'Shippers'
            )
        ) {
            searchData.value = [
                { header: 'Shippers' },
                ...value,
                ...searchData.value,
            ];

            mutationCount.value++;
        }
    } else if (
        mutationProperty === 'laneList'
    ) {
        if (
            !searchData.value.some(
                (i) => i.header === 'Lanes'
            )
        ) {
            searchData.value = [
                ...searchData.value,
                { divider: true },
                { header: 'Lanes' },
                ...value,
            ];

            mutationCount.value++;
        }
    }

    if (mutationCount.value >= 2) {
        unsubscribe?.();

        appStore.setFirstLoad(false);
    }
}

function customFilter(_value, query, item) {
    const itemText =
        item?.raw?.name ?? '';

    const cleaned = query
        .replace(
            /[&@\\/#?!|^_,`+=()$~%.'";:*?<>{}]/g,
            ' '
        )
        .toLocaleLowerCase();

    const fillers = new Set([
        'to',
        'and',
    ]);

    return cleaned
        .split(' ')
        .filter(
            (t) =>
                t &&
                !fillers.has(t)
        )
        .every((token) =>
            itemText
                .toLocaleLowerCase()
                .includes(token)
        );
}

onMounted(() => {
    if (appStore.firstLoad) {
        unsubscribe =
            appStore.$subscribe(
                (_mutation, state) => {
                    populate(
                        'brokerList',
                        state.brokerList
                    );

                    populate(
                        'shipperList',
                        state.shipperList
                    );

                    populate(
                        'laneList',
                        state.laneList
                    );
                }
            );
    } else if (!isBrokerUser.value) {
        searchData.value = [
            { header: 'Brokers' },

            ...(appStore.brokerList ?? []),

            { divider: true },

            { header: 'Lanes' },

            ...(appStore.laneList ?? []),
        ];
    } else {
        searchData.value = [
            { header: 'Shippers' },

            ...(appStore.shipperList ?? []),

            { divider: true },

            { header: 'Lanes' },

            ...(appStore.laneList ?? []),
        ];
    }
});

onUnmounted(() => {
    unsubscribe?.();
});
</script>

<style scoped>
.rotate-135 {
    transform: rotate(135deg);
}
</style>
