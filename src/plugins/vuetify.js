import 'vuetify/styles';

import { createVuetify } from 'vuetify';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { aliases, mdi } from 'vuetify/iconsets/mdi';

import '@mdi/font/css/materialdesignicons.css';

import CalculatorIcon from '../components/icons/CalculatorIcon.vue';
import CalculatorIconSidebar from '../components/icons/CalculatorIconSidebar.vue';

export default createVuetify({
    components,
    directives,

    theme: {
        defaultTheme: 'light',

        themes: {
            light: {
                dark: false,

                colors: {
                    background: '#f5f8ff',
                    navbar: '#0091ff',
                    sidebarBackground: '#ffffff'
                }
            },

            dark: {
                dark: true,

                colors: {
                    background: '#181818',
                    navbar: '#121212',
                    iconColor: '#D9D9D9',
                    sidebarBackground: '#1A1A1A'
                }
            }
        }
    },

    icons: {
        defaultSet: 'mdi',

        aliases: {
            ...aliases,

            calc: CalculatorIcon,
            calcSidebar: CalculatorIconSidebar
        },

        sets: {
            mdi
        }
    }
});