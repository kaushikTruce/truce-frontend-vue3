import { createApp } from 'vue';
import App from './App.vue';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import VPhoneInput from 'v-phone-input';
import 'v-phone-input/dist/v-phone-input.css';

const vuetify = createVuetify();

const app = createApp(App);

app
    .use(vuetify)
    .use(VPhoneInput)
    .mount('#app');