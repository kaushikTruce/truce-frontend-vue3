import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import VueApexCharts from "vue3-apexcharts";

import {
    fetchAuthSession,
    fetchUserAttributes,
    getCurrentUser,
    signOut
} from 'aws-amplify/auth';
import { configureAmplify } from './authentication/aws-exports';

import Landing from './landing/Landing.vue';
import Login from './containers/Login.vue';
import ShipperDashboard from './containers/ShipperDashboard.vue';
import App from './App.vue';

import vuetify from './plugins/vuetify'
import 'vuetify/styles';

import '@mdi/font/css/materialdesignicons.css';
import './us-map';

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

configureAmplify();

const guard = async (to) => {
    if (to.query.skipGuard){
        return true;
    }

    try {
        const session = await fetchAuthSession({
            forceRefresh: true
        });

        const idToken = session.tokens?.idToken;
        const accessToken = session.tokens?.accessToken;

        if (!idToken || !accessToken) {
            throw new Error ('Session tokens missing');
        }

        const now = Math.floor(Date.now() / 1000);

        if (
            idToken.payload.exp < now ||
            accessToken.payload.exp < now
        ){
            throw new Error('Session expired');
        }

        await getCurrentUser();

        return true;
    } catch (error) {
        console.error('Authentication error:', error);

        try {
            await signOut({
                global: true
            });
        } catch (signOutError) {
            console.error('Error during sign out:', signOutError);
        }

        localStorage.clear();

        return {
            path: '/app/login',
            query: {
                redirect: to.fullPath,
                sessionExpired: 'true'
            }
        };
    }

};

const routes = [
    {
        path: '/',
        name: 'landing',
        component: Landing,

            beforeEnter: () => {
                if (window.location.href.includes('app.truce-dev.com')) {
                    window.location.href = 'https://truce-dev.com';
                    return false;
                } else if (window.location.href.includes('app.truce.io')) {
                    window.location.href = 'https://truce.io';
                    return false;
                } else {
                    return true;
                }
            }
    },
    {
        name: 'app',
        path: '/app',
        redirect: '/app/login'
    },

    {
        name: 'login',
        path: '/app/login',
        component: Login,

        beforeEnter: async () => {
            try {
                const user = await getCurrentUser();

                if (user) {
                    const attributes =
                        await fetchUserAttributes();

                    const role =
                        attributes?.['custom:role'];

                    const dashboardPath =
                        role === 'shipper'
                            ? '/app/brokerDashboard'
                            : '/app/shipperDashboard';

                    return {
                        path: dashboardPath
                    };
                }

                return true;
            } catch (error) {
                return true;
            }
        }
    },
    {
        name: 'broker-dashboard',
        path: '/app/brokerDashboard',
        component: ShipperDashboard,
        props: true,
        beforeEnter: guard
    },
    {
        name: 'shipper-dashboard',
        path: '/app/shipperDashboard',
        component: ShipperDashboard,
        props: true,
        beforeEnter: guard
    },
    {
        name: 'lane-dashboard',
        path: '/app/laneDashboard',
        component: ShipperDashboard,
        props: true,
        beforeEnter: guard
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App);
app.use(vuetify).use(router).use(pinia).use(VueApexCharts);
app.mount('#app');
