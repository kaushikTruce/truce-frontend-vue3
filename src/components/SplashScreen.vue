<template>
  <div v-if="isLoading">
    <v-overlay
      :model-value="true"
      class="align-center justify-center"
      contained
    >
      <div class="d-flex flex-column align-center">
        <v-img
          alt="Truce Logo"
          class="mb-6"
          contain
          src="@/assets/Truce_Logo_Black.png"
          width="110"
        />

        <div id="loading-wrapper">
          <div id="loading-text"></div>
          <div id="loading-content"></div>
        </div>
      </div>
    </v-overlay>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const isLoading = computed(() => props.isLoading)
</script>

<style scoped>
#loading-wrapper {
  position: relative;
  width: 170px;
  height: 170px;
}

#loading-text {
  position: absolute;
  top: 50%;
  left: 50%;
  color: #999;
  width: 100px;
  height: 30px;
  margin: -15px 0 0 -45px;
  text-align: center;
  font-family: 'DM Sans', sans-serif;
  font-size: 20px;
}

#loading-content {
  position: relative;
  width: 170px;
  height: 170px;
  border: 3px solid transparent;
  border-top-color: #1aabff;
  border-bottom-color: #1aabff;
  border-radius: 50%;
  animation: loader 2s linear infinite;
}

#loading-content::before {
  content: '';
  position: absolute;
  top: 5px;
  right: 5px;
  bottom: 5px;
  left: 5px;
  border: 3px solid transparent;
  border-top-color: #ffab6b;
  border-bottom-color: #ffab6b;
  border-radius: 50%;
  animation: loader 3s linear infinite;
}

#loading-content::after {
  content: '';
  position: absolute;
  top: 15px;
  right: 15px;
  bottom: 15px;
  left: 15px;
  border: 3px solid transparent;
  border-top-color: #de3978;
  border-bottom-color: #de3978;
  border-radius: 50%;
  animation: loader 1.5s linear infinite;
}

@keyframes loader {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
