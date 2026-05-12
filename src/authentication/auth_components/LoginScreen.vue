<template>
  <form autocomplete="email">
    <input
      type="password"
      style="display: none"
      name="whatever"
      autocomplete="email"
    />
    <v-text-field
      prepend-inner-icon="mdi-account"
      label="Email"
      :rules="[rules.required, rules.email]"
      v-model="email"
      :autofocus="true"
      @input="emitEmail"
      @keyup.enter="emitLogin"
    ></v-text-field>

    <v-text-field
      prepend-inner-icon="mdi-lock"
      :rules="[rules.required, rules.min]"
      :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="passwordVisible = !passwordVisible"
      :type="passwordVisible ? 'password' : 'text'"
      label="Password"
      v-model="password"
      @input="emitPassword"
      @keyup.enter="emitLogin"
    ></v-text-field>

    <p
      class="link forgot-password"
      @click="emitForgotPassword"
      style="color: #545454"
    >
      Forgot Password?
    </p>

    <br />
    <br />
    <br />
  </form>
</template>

<script setup>
import { onMounted, ref } from "vue";

const emit = defineEmits([
  "emailUpdate",
  "passwordUpdate",
  "forgotPassword",
  "triggerLogin",
]);

const email = ref("");
const password = ref("");
const passwordVisible = ref(true);

const rules = {
  required: (value) => !!value || "Required.",
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return pattern.test(value) || "Invalid e-mail.";
  },

  min: (v) => v?.length >= 8 || "Min 8 characters",
};

const emitEmail = () => {
  emit("emailUpdate", email.value.replace(/\s/g, ""));
};

const emitPassword = () => {
  emit("passwordUpdate", password.value.replace(/\s/g, ""));
};

const emitForgotPassword = () => {
  emit("forgotPassword", true);
};

const emitLogin = () => {
  emit("triggerLogin");
};

onMounted(() => {
  let intervalDetectAutofill = setInterval(() => {
    if (
      document.querySelectorAll('input[type="text"]:-webkit-autofill').length >
      0
    ) {
      const fields = document.querySelectorAll(".v-field__label");
      fields.forEach((field) =>
        field.classList.add("v-field__label--floating"),
      );

      clearInterval(intervalDetectAutofill);
      intervalDetectAutofill = null;
    }
  }, 50);

  setTimeout(() => {
    if (intervalDetectAutofill) {
      clearInterval(intervalDetectAutofill);
      intervalDetectAutofill = null;
    }
  }, 1000);
});
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

.forgot-password {
  float: right;
  cursor: pointer;
}
</style>
