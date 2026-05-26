import 'vuetify/styles';

import { createVuetify } from 'vuetify';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { aliases, mdi } from 'vuetify/iconsets/mdi';

import '@mdi/font/css/materialdesignicons.css';

import CalculatorIcon from '@/components/Icons/CalculatorIcon.vue';
import CalculatorIconSidebar from '@/components/Icons/CalculatorIconSidebar.vue';

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
                    navbar: '#0091ff'
                }
            },

            dark: {
                dark: true,

                colors: {
                    background: '#181818',
                    navbar: '#121212'
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