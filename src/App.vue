<template>
  <div id="app">
    <RouterView :key="route.fullPath" />
  </div>
</template>

<script setup>
import { onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'

import { getStateProperty } from './stateAPI'

const route = useRoute()
const theme = useTheme()

function handleThemeChange(isDark) {
  const htmlTag = document.documentElement

  if (isDark) {
    htmlTag.classList.add('dark-mode')
  } else {
    htmlTag.classList.remove('dark-mode')
  }
}

onBeforeMount(() => {
  const darkMode = getStateProperty('darkMode')

  theme.change(darkMode ? 'dark' : 'light')

  handleThemeChange(darkMode)

  watch(
    () => theme.global.current.value.dark,
    (newVal) => {
      handleThemeChange(newVal)
    }
  )
})
</script>

<style>
html {
  overflow-y: auto;
}

/* width */
html.dark-mode ::-webkit-scrollbar {
  width: 10px;
}

/* Track */
html.dark-mode ::-webkit-scrollbar-track {
  background: #272727;
}

/* Handle */
html.dark-mode ::-webkit-scrollbar-thumb {
  background: #3f3f3f;
}

/* Handle on hover */
html.dark-mode ::-webkit-scrollbar-thumb:hover {
  background: #4c4c4c;
}

.v-data-table {
  background-color: var(--v-dataTableBackground-base) !important;
}

.main-container {
  padding: 48px 0px 0px 43px !important;
}
</style>