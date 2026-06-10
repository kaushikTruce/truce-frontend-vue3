import 'vuetify/styles';

import { createVuetify } from 'vuetify';

import * as components from 'vuetify/components';
import * as labsComponents from 'vuetify/labs/components';
import * as directives from 'vuetify/directives';

import { aliases, mdi } from 'vuetify/iconsets/mdi';

import '@mdi/font/css/materialdesignicons.css';

import CalculatorIcon from '../components/Icons/CalculatorIcon.vue';

export default createVuetify({
    components: {
        ...components,
        ...labsComponents,
    },
    directives,

    theme: {
        defaultTheme: 'light',

        themes: {
            light: {
                dark: false,

                colors: {
                    background: '#f5f8ff',
                    navbar: '#0091ff',
                    search: '#212121',
                    wand: '#83c5f7',
                    graphBackground: '#ffffff',
                    headerIcon: '#0D47A1',
                    dateRangeBtnColor: '#89adcd',
                    dateRangeBtnBackgroundColor: '#ffffff',
                    styleCBackgroundColor: '#f0f8ff',
                    shadeGreenStyleBackgroundColor: '#e9fef7',
                    styleABackgroundColor: '#ffffff',
                    shadeRedStyleBackgroundColor: '#fdf2f3',
                    metricStyleColor: '#000000',
                    cellGradColorStart: '#f0f8ff',
                    cellGradColorEnd: '#ffffff',
                    shadeGreenCellGradColorStart: '#e3fff7',
                    shadeGreenCellGradColorEnd: '#ffffff',
                    shadeRedCellGradColorStart: '#fff2f2',
                    shadeRedCellGradColorEnd: '#ffffff',
                    scorecardMetricColor: '#000000',
                    expandedTableCellColor: '#ffffff',
                    vdtExpandedRowColor: '#eeeeee',
                    shipmentHeaderStylingColor: '#e3f2fd',
                    dataTableBackground: '#ffffff',
                    sidebarBackground: '#ffffff',
                    chipColor: '#FF6F00',
                    filterBtnBackground: '#0091ff',
                    exportBackgroundColor: '#ffffff',
                    sideBar: '#717171'
                }
            },

            dark: {
                dark: true,

                colors: {
                    background: '#181818',
                    navbar: '#121212',
                    wand: '#ffeb3b',
                    graphBackground: '#262626',
                    headerIcon: 'rgba(0, 145, 255, 0.85)',
                    dateRangeBtnColor: '#447af7',
                    dateRangeBtnBackgroundColor: '#2B2B2B',
                    styleCBackgroundColor: '#2B2C2D',
                    shadeGreenStyleBackgroundColor: '#39603c',
                    styleABackgroundColor: '#2B2B2B',
                    shadeRedStyleBackgroundColor: '#5c302b',
                    metricStyleColor: '#E9E9E9',
                    cellGradColorStart: '#2B2C2D',
                    cellGradColorEnd: '#262626',
                    shadeGreenCellGradColorStart: '#39603c',
                    shadeGreenCellGradColorEnd: '#262626',
                    shadeRedCellGradColorStart: '#5c302b',
                    shadeRedCellGradColorEnd: '#262626',
                    scorecardMetricColor: '#E9E9E9',
                    expandedTableCellColor: '#2B2B2B',
                    vdtExpandedRowColor: '#424242',
                    shipmentHeaderStylingColor: '#5C5C5C',
                    dataTableBackground: '#262626',
                    dataTableText: '#EEEEEE',
                    cardBackgroundColor: '#262626',
                    iconColor: '#D9D9D9',
                    sidebarBackground: '#1A1A1A',
                    metricValueColor: '#E9E9E9',
                    chipColor: 'rgba(255,  123,  15, 0.7)',
                    filterBtnBackground: 'rgba(0, 145, 255, 0.75)',
                    exportBackgroundColor: '#262626',
                    sideBar: '#d9d9d9'
                }
            }
        }
    },

    icons: {
        defaultSet: 'mdi',

        aliases: {
            ...aliases,
            calc: CalculatorIcon,
        },

        sets: {
            mdi
        }
    }
});
