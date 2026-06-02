<template>
    <v-app-bar
        :color="appStore.isDarkMode ? 'surface' : 'navbar'"
        density="compact"
        clipped-left
        flat
        border="b"
    >
        <div class="d-flex align-center">
            <v-img
                alt="Truce Logo"
                class="shrink mr-2"
                contain
                src="../assets/Truce_Logo.png"
                width="120"
            />
        </div>
 
        <v-spacer />
 
        <SearchBar />
 
        <!-- Notification Menu -->
        <v-menu
            v-model="notificationMenu"
            :close-on-content-click="false"
            width="360"
            transition="slide-y-transition"
            location="bottom end"
        >
            <template #activator="{ props: menuProps }">
                <v-btn icon v-bind="menuProps" variant="text">
                    <v-badge
                        dot
                        color="error"
                        :model-value="newNotifs.length > 0"
                    >
                        <v-icon color="iconColor">mdi-bell</v-icon>
                    </v-badge>
                </v-btn>
            </template>
 
            <v-card>
                <v-list
                    lines="two"
                    style="max-height: 220px"
                    class="overflow-y-auto"
                >
                    <template v-if="newNotifs.length > 0">
                        <template
                            v-for="(item, index) in newNotifs"
                            :key="index"
                        >
                            <v-list-subheader v-if="item.header">
                                {{ item.header }}
                            </v-list-subheader>
 
                            <v-divider
                                v-else-if="item.divider"
                                :inset="item.inset"
                            />
 
                            <v-list-item v-else :key="item.subject">
                                <template #prepend>
                                    <v-icon color="blue-darken-4">
                                        mdi-bell
                                    </v-icon>
                                </template>
 
                                <v-badge dot color="#FFD200">
                                    <v-list-item-title>
                                        {{ item.subject }} - {{ item.sender }}
                                    </v-list-item-title>
                                </v-badge>
 
                                <v-list-item-subtitle
                                    style="max-width: 400px"
                                    v-html="item.message"
                                />
                            </v-list-item>
                        </template>
                    </template>
 
                    <v-list-item v-else>
                        <v-list-item-title
                            class="text-center text-medium-emphasis"
                            style="cursor: default"
                        >
                            No new notifications
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
 
                <v-divider />
 
                <v-list>
                    <v-list-item
                        class="notification-hover"
                        @click="goToNotifications"
                    >
                        <v-list-item-title class="text-center">
                            See all notifications
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>
 
        <v-divider vertical class="mx-2 nav-divider" />
 
        <!-- User Menu -->
        <v-menu
            v-model="userMenu"
            :close-on-content-click="false"
            transition="slide-y-transition"
            location="bottom end"
        >
            <template #activator="{ props: menuProps }">
                <v-btn
                    class="user-button"
                    variant="text"
                    v-bind="menuProps"
                >
                    <span class="mr-2 text-iconColor">{{ username }}</span>
                    <v-avatar size="35">
                        <v-icon size="32" color="iconColor">
                            mdi-account-circle
                        </v-icon>
                    </v-avatar>
                </v-btn>
            </template>
 
            <v-card elevation="0" rounded max-width="300">
                <v-list border="t">
                    <!-- Dark Mode Toggle -->
                    <v-list-item>
                        <v-switch
                            v-model="isDarkMode"
                            :label="`${isDarkMode ? 'Disable' : 'Enable'} Dark Mode`"
                            color="primary"
                            hide-details
                            density="compact"
                            class="darkModeSwitch"
                            @update:model-value="toggleDarkMode"
                        />
                    </v-list-item>
 
                    <v-list-item
                        v-for="(item, index) in menuItems"
                        :key="index"
                        @click="item.func"
                    >
                        <template #prepend>
                            <v-icon color="iconColor" class="mr-2">
                                {{ item.icon }}
                            </v-icon>
                        </template>
                        <v-list-item-title class="text-iconColor">
                            {{ item.title }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>
    </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAppStore } from '../stateAPI';
import { useTheme } from 'vuetify';
import { onBeforeMount, onMounted, ref, computed } from 'vue';
import { signOut } from 'aws-amplify/auth';
import * as fetchAccountDetails from '../fetchAccountDetails';
import * as fetchNotifications from '../fetchNotifications';
import SearchBar from './Search.vue';


const appStore = useAppStore();
const router = useRouter();
const vuetifyTheme = useTheme();

const userMenu = ref(false);
const notificationMenu = ref(false);
const newNotifs = ref([]);
const isDarkMode = ref(false);
const curConfig = ref(null);

// Derived from state (safe access when store may not have these properties yet)
const username = computed(() => appStore.username ?? '');
const email = computed(() => appStore.email ?? '');

const handleSignOut = async () => {
    try {
        await signOut({global: true});
    } catch {
        localStorage.clear();
        sessionStorage.clear();
    } finally {
        router.push({name: 'login'})
    }
}

const goToAccount = () => {
    router.push({
        name: 'account',
        query: { prop_usn: appStore.username },
    });
}

const menuItems = [
    { title: 'Account', icon: 'mdi-account', func: goToAccount },
    { title: 'Sign Out', icon: 'mdi-logout', func: handleSignOut },
];

const goToNotifications = () => {
    router.push({
        name: 'notifications',
        query: { prop_usn: appStore.username },
    });
}

const getCurrentConfig = async () => {
    if (!email.value) return

    try {
        const result = await fetchAccountDetails.getAccountDetails({
            email: email.value,
            config: 1,
        });
        if (result?.status === 200) {
            const configStr = result?.data?.records?.[0]?.config;
            if (configStr) {
                curConfig.value = JSON.parse(configStr);
            }
            isDarkMode.value = curConfig.value?.darkMode ?? false;
        }
    } catch (err) {
        console.error('Failed to fetch config:', err);
    }
}

const toggleDarkMode = async (value) => {
    isDarkMode.value = value;
    appStore.setDarkMode(value);
    vuetifyTheme.global.name.value = value ? 'dark' : 'light';
 
    if (!curConfig.value) return
    
    curConfig.value.darkMode = value;
 
    try {
        if (email.value) {
            await fetchAccountDetails.updateAccountDetails({
                email: email.value,
                config: 1,
                new_config: JSON.stringify(curConfig.value),
            });
        }
    } catch (err) {
        console.error('Failed to update dark mode config:', err);
    }
}


onBeforeMount(async () => {
    await getCurrentConfig();
})


onMounted(async () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const priorWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
 
    try {
        if (email.value) {
            const result = await fetchNotifications.getNotifications({
                email: email.value,
                start_date: priorWeek,
                end_date: today,
                new: 1,
            });
            newNotifs.value = result ?? [];
        }
    } catch (err) {
        console.error('Failed to fetch notifications:', err);
    }
})
</script>

<style scoped>
.nav-divider {
    margin-inline: 6px;
}
 
.user-button {
    background-color: transparent !important;
    box-shadow: none !important;
}
 
.notification-hover:hover {
    cursor: pointer;
}
 
.darkModeSwitch {
    font-size: 0.85rem;
}
</style>