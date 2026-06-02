<template>
    <v-app>
        <NavBar />
        <SideBar />
    </v-app>

</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import SideBar from '../components/SideBar.vue';
</script>


<style lang="scss">
.green {
    color: green;
}
 
.red {
    color: red;
}
 
.metric-value {
    font-weight: 400;
    font-size: 23px;
}
 
tbody {
    tr:hover {
        cursor: pointer;
    }
}
 
ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
}
 
.metricTrendTabs .v-tab {
    min-width: fit-content;
}
 
.v-theme--dark {
    .v-card {
        background-color: rgb(var(--v-theme-cardBackgroundColor));
    }
 
    .moneyTab {
        background-color: rgb(var(--v-theme-cardBackgroundColor));
    }
 
    .projectionTab {
        background-color: rgb(var(--v-theme-cardBackgroundColor));
    }
 
    .performanceTab {
        background-color: rgb(var(--v-theme-cardBackgroundColor));
    }
 
    .selectorDateTabs .v-slide-group {
        background-color: rgb(var(--v-theme-cardBackgroundColor)) !important;
    }
 
    .metricTrendTabs .v-slide-group {
        background-color: rgb(var(--v-theme-cardBackgroundColor)) !important;
    }
 
    .metric-value {
        color: rgb(var(--v-theme-metricValueColor));
    }
 
    .darkModeSwitch .v-label {
        color: rgb(var(--v-theme-metricValueColor));
    }
}
</style>