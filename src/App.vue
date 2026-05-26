<template>
  <div id="app">
    <RouterView :key="route.fullPath" />
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, watch } from 'vue'
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
})

watch(
  () => theme.global.current.value.dark,
  (newVal) => {
    handleThemeChange(newVal)
  }
)

// const initializeRB2B = () => {
//   const reb2b = window.reb2b = window.reb2b || [];
//   if (reb2b.invoked) return;
//   reb2b.invoked = true;
//   reb2b.methods = ["identify", "collect"];
//   reb2b.factory = (method) => {
//     return (...args) => {
//       reb2b.push([method, ...args])
//       return reb2b
//     }
//   }

//   reb2b.methods.forEach(method => {
//     reb2b[method] = reb2b.factory(method)
//   });

//   reb2b.load = (key) => {
//     const script = document.createElement('script')
//     script.async = true
//     script.src = `https://s3-us-west-2.amazonaws.com/b2bjsstore/b/${key}/reb2b.js.gz`
//     document.head.appendChild(script)
//   }

//   reb2b.SNIPPET_VERSION = '1.0.1'
//   reb2b.load('4N210HQ70R6Z')
// }

// onMounted(() => {
//   initializeRB2B()
// })


</script>

<style>
html {
  overflow-y: auto;
}

html.dark-mode {
  scrollbar-color: #3f3f3f #272727;
  scrollbar-width: thin;
}

.v-data-table {
  background-color: var(--v-dataTableBackground-base) !important;
}

.main-container {
  padding: 48px 0px 0px 43px !important;
}
</style>
