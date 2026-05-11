<template>
    <div>
        <v-row class="justify-center" style="color: #545454">
            We'll send a verification code to your email.
        </v-row>
        <v-row>
            <v-col cols="8">
                <v-text-field
                    prepend-inner-icon="mdi-account"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                    v-model="email"
                ></v-text-field>
            </v-col>
            <v-col cols="4">
                <v-btn
                    class="mt-3"
                    @click="sendResetEmail"
                    color="#0091ff"
                    variant="outlined"
                >
                    Send Email
                </v-btn>
            </v-col>
        </v-row>
        <p v-if="email_sent" style="color: red">
            We've sent you an email with your verification code.
        </p>
    </div>
</template>

<script setup>
import { resetPassword } from 'aws-amplify/auth';
import { ref, watch } from 'vue';

const emit = defineEmits([
    'emailUpdate',
    'error',
    'emailSent'
])

const email = ref('')
const email_sent = ref(false)

const rules = {
    required: (value) => !!value || 'Required.',
    email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
    }
}

watch(email, (value) => {
    emit('emailUpdate', value)
})

const sendResetEmail = async () => {
    if (!email.value || !email.value.includes('@')){
        emit('error', true);
        return;
    }

    try{
        await resetPassword({
            username: email.value
        });
        email_sent.value = true;
        emit('emailSent', true)
    } catch (e){
        console.error('Error occurred:', e);
        emit('error', true);
    }
}


</script>

<style scoped>
.link {
    font-size: 13px;
    color: grey;
}

.forgot-password {
    float: right;
    cursor: pointer;
}
</style>
