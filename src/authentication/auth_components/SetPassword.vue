<template>

    <div>
        <v-row class="pb-6 pl-3">
            <v-row class="py-3 pl-2">
                <v-col cols="12" style="color: #545454">
                    Your password must have the following:
                </v-col>
            </v-row>
            <v-row
                v-for="(rule, i) in passwordCreationRules"
                :key="i"
                class="link text-start"
                style="color: #545454"
                density="compact"
            >
                <v-col cols="12">
                    <v-icon
                        style="margin-top: -2px; margin-right: 5px"
                        :color="rule.status ? 'green' : 'red'"
                    >
                        {{ rule.status ? 'mdi-check' : 'mdi-close' }}
                    </v-icon>
                    {{ rule.value }}
                </v-col>
            </v-row>
        </v-row>

        <v-text-field
            prepend-inner-icon="mdi-lock"
            label="Password *"
            v-model="password"
            required
            :append-inner-icon="passwordVisibility ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="passwordVisibility = !passwordVisibility"
            :type="passwordVisibility ? 'password' : 'text'"
            :rules="[rules.required]"
            @input="validatePassword"
            @keyup.enter="emitLogin"
        >
        </v-text-field>

        <v-text-field
            prepend-inner-icon="mdi-lock"
            label="Confirm Password *"
            v-model="confirmPassword"
            :append-inner-icon="passwordVisibility ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="passwordVisibility = !passwordVisibility"
            :type="passwordVisibility ? 'password' : 'text'"
            required
            :rules="[password === confirmPassword || 'Password must match']"
            @input="emitConfirmPassword"
            @keyup.enter="emitLogin"
        >
        </v-text-field>

        <v-text-field
            v-if="props.tokenReset"
            v-model="token"
            label="Verification Code"
            type="number"
            class="mt-2"
            variant="outlined"
            @input="emitToken"
            @keyup.enter="emitLogin"
            required
        >
        </v-text-field>
    </div>
</template>


<script setup>
import { ref } from 'vue';


const props = defineProps({
    tokenReset: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits([
    'confirmPasswordUpdate',
    'tokenUpdate',
    'triggerLogin',
    'setPasswordUpdate',
    'creationRuleUpdate'
]);

const password = ref('');
const confirmPassword = ref('');
const passwordVisibility = ref(true);
const token = ref(null);

const rules = {
    required: (value) => !!value || 'Required.'
}

const passwordCreationRules = ref([
  { rule: 'lowercase', status: false, value: 'Must contain a lowercase letter.' },
  { rule: 'uppercase', status: false, value: 'Must contain an uppercase letter.' },
  { rule: 'numerical', status: false, value: 'Must contain a numerical character.' },
  { rule: 'special',   status: false, value: 'Must contain a special character.' },
  { rule: 'length',    status: false, value: 'Must be at least 8 characters in length.' }
])

const validateAllCreationRules = () => {
    let allCreationRulesSatisfied = true;
    for (let i = 0; i < passwordCreationRules.value.length; i++) {
        if (!passwordCreationRules.value[i].status) {
            allCreationRulesSatisfied = false;
        }
    }
    return allCreationRulesSatisfied;
};

const emitConfirmPassword = () => {
    emit('confirmPasswordUpdate', confirmPassword.value);
};

const emitToken = () => {
    emit('tokenUpdate', token.value);
};

const emitLogin = () => {
    emit('triggerLogin');
};

const updateCreationRule = (rule, set) => {
    for (let i = 0; i < passwordCreationRules.value.length; i++) {
        if (passwordCreationRules.value[i].rule === rule){
            passwordCreationRules.value[i].status = set;
        }
    }
};

const validatePassword = (value) => {
    updateCreationRule('lowercase', /[a-z]/.test(value));
    updateCreationRule('uppercase', /[A-Z]/.test(value));
    updateCreationRule('numerical', /\d/.test(value));
    updateCreationRule(
        'special', 
        /[~`!@#$%^&*+=\-[\]\\';,/{}|\\":<>?]/.test(value)
    );
    updateCreationRule('length', value.length >= 8);
    emit('setPasswordUpdate', password.value);
    emit('creationRuleUpdate', validateAllCreationRules());
}




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