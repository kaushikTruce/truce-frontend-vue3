import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { Amplify } from 'aws-amplify';
import {
    fetchAuthSession,
    getCurrentUser,
    signOut
} from 'aws-amplify/auth';
import awsconfig from './authentication/aws-exports';

import Landing from './landing/Landing.vue';
import App from './App.vue';

import { createVuetify } from 'vuetify';
import 'vuetify/styles';

import '@mdi/font/css/materialdesignicons.css';
import './us-map';

Amplify.configure({
    ...awsconfig,
    API: {
        REST: {
            SBUAccess: {
                endpoint: 'https://llvtzheyh4.execute-api.us-east-1.amazonaws.com/prod'
            },

            Contact: {
                endpoint: 'https://gkiuzzt1h8.execute-api.us-east-1.amazonaws.com/contactTest'
            },

            ResendTempPassword: {
                endpoint: 'https://jzbd0kolh3.execute-api.us-east-1.amazonaws.com/dev'
            }
        }
    },

    Storage: {
        S3: {
            bucket: 'broker-data-upload',
            region: 'us-east-1'
        }
    }
});

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
                console.log('landing beforeEnter:', { href: window.location.href });

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
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

const vuetify = createVuetify();
const app = createApp(App);
app.use(vuetify).use(router);
app.mount('#app');