<template>
    <div>
        <v-row class="pb-4">
            <v-col cols="6">
                <v-text-field
                    prepend-inner-icon="mdi-account"
                    label="First Name *"
                    required
                    :rules="[rules.required, rules.alphabetic, rules.max]"
                    v-model="first_name"
                >
                </v-text-field>
            </v-col>
            <v-col cols="6">
                <v-text-field
                    prepend-inner-icon="mdi-account"
                    label="Last Name *"
                    required
                    :rules="[rules.required, rules.alphabetic, rules.max]"
                    v-model="last_name"
                >
                </v-text-field>
            </v-col>
        </v-row>
        <v-phone-input
            v-model="phone_number"
            :required="true"
            style="margin-top: 10px"
        ></v-phone-input>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue';

const emit = defineEmits([
    'firstNameUpdate',
    'lastNameUpdate',
    'phoneNumberUpdate'
]);

const first_name = ref('');
const last_name = ref('');
const phone_number = ref('');

const rules = {
    required: (value) => !!value || 'Required.',
    alphabetic: (value) => {
        const pattern = /^[a-zA-Z\s]*$/;
        return (
            pattern.test(value) || 'Invalid characters. Only letters are allowed'
        );
    },

    max: (v) => v.length <= 40 || 'Max 40 characters'
};

watch(first_name, (value) => {
    emit('firstNameUpdate', value);
});

watch(last_name, (value) => {
    emit('lastNameUpdate', value);
});

watch(phone_number, (value) => {
    emit('phoneNumberUpdate', value)
})


</script>

<style scoped>
.link {
    font-size: 13px;
    color: grey;
}

.login-button {
    background: linear-gradient(90deg, #ff7a10, #ff7a10) !important;
    color: white !important;
    border-radius: 100px !important;
    margin-bottom: 10px;
}
</style>