<template>
  <v-data-table
    :headers="activeHeaders"
    :items="displayedData"
    v-model:expanded="expanded"
    :item-value="itemKey"
    :show-expand="!props.is_shipper_dashboard"
    :expand-on-click="true"
    :show-select="showSelect"
    class="elevation-1 dataTable"
    :items-per-page-options="[10, 25, 50, 100]"
    :items-per-page="100"
    v-model:sort-by="sortByModel"
    @click:row="onRowClick"
    @update:options="emitUpdatedOptions"
    :items-length="serverItemsLength"
    :row-props="itemRowWidth"
    :loading="isTableLoading"
    v-model="selected"
    @update:model-value="emitSelectedOptions">
    <template v-for="col in tooltipHeaders" :key="col" v-slot:[`header.${col}`]="{ column }">
      <Tooltip :header_text="column.title" :header_tool="column.tooltip" />
    </template>

    <template #header.avg_margin="{ column }">
      <v-tooltip location="top" max-width="320">
        <template #activator="{ props: tipProps }">
          <span v-bind="tipProps">{{ column.title }}</span>
        </template>
        <span>{{ column.tooltip }}</span>
      </v-tooltip>
    </template>

    <template #header.avg_margin_dollars="{ column }">
      <v-tooltip location="top" max-width="320">
        <template #activator="{ props: tipProps }">
          <span v-bind="tipProps">{{ column.title }}</span>
        </template>
        <span>{{ column.tooltip }}</span>
      </v-tooltip>
    </template>

    <!-- Goto drilldown / favorite icon column -->
    <template v-if="!props.is_shipper_dashboard && !showSelect" #item.gotoDrilldownIcon="{ item }">
      <v-tooltip location="top" max-width="320" :open-delay="1250">
        <template #activator="{ props: tipProps }">
          <v-btn v-if="props.is_lane_data" icon v-bind="tipProps" size="small" variant="text"
            @click.stop.prevent="updateFavoriteLanes(item)">
            <v-icon :color="isFavoriteLane(item) ? 'orange' : 'grey'" size="small">
              {{ isFavoriteLane(item) ? 'mdi-star' : 'mdi-star-outline' }}
            </v-icon>
          </v-btn>
        </template>
        <span>Favorite Lane</span>
      </v-tooltip>

      <v-tooltip v-if="showGotoItemDrilldown(item)" location="top" max-width="320" :open-delay="1250">
        <template #activator="{ props: tipProps }">
          <span v-bind="tipProps">
            <v-icon class="gotoIcon" style="font-size: 18px !important" @click.stop.prevent="gotoItemDrilldown(item)">
              mdi-forwardburger
            </v-icon>
          </span>
        </template>
        <span>{{ getGotoDrilldownTooltip(item) }}</span>
      </v-tooltip>
    </template>

    <!-- Data staleness icon (shipper dashboard) -->
    <template v-if="props.is_shipper_dashboard" #item.max_ingestion_time="{ item }">
      <v-tooltip location="top" max-width="320" :open-on-hover="false" :open-on-focus="false">
        <template #activator="{ props: tipProps }">
          <v-btn icon v-bind="tipProps" variant="text" @click.stop.prevent>
            <v-icon style="font-size: 18px !important" :color="getDataStalenessColor(item)">
              mdi-database-refresh-outline
            </v-icon>
          </v-btn>
        </template>
        <span>{{ getDataStalenessTooltip(item) }}</span>
      </v-tooltip>
    </template>

    <!-- Name column -->
    <template #item.name="{ item }">
      <span v-if="!isBrokerUser && !props.is_lane_data && item.active_status === 'inactive'">
        <v-chip size="small">inactive</v-chip>
      </span>
      <span>{{ item.name }}</span>
    </template>

    <!-- Score column -->
    <template #item.score="{ item }">
      <v-menu :close-on-content-click="false" :width="220" location="end" transition="scroll-x-transition">
        <template #activator="{ props: menuProps }">
          <v-chip v-if="showBadgeTooltip(item.avg_carrier_score, item.avg_broker_score, item.avg_load_creation_time)"
            :color="getColor(item.score)" v-bind="menuProps">
            <v-tooltip location="top" :open-delay="1000">
              <template #activator="{ props: tipProps }">
                <span v-bind="tipProps">{{ formatScore(item.score) }}</span>
              </template>
              <span>Incomplete Score</span>
            </v-tooltip>
          </v-chip>
          <v-chip v-else :color="getColor(item.score)" v-bind="menuProps">
            {{ formatScore(item.score) }}
          </v-chip>
        </template>

        <v-card class="pa-1">
          <v-card-title class="pb-0">Score Breakdown</v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-row class="ma-0 py-2">
                  On-Time Pickup
                  {{ formatScore(item.avg_otp_score) === '--' ? '--' : '' }}
                  <v-progress-linear v-if="formatScore(item.avg_otp_score) !== '--'"
                    :model-value="formatScore(item.avg_otp_score)" :color="getColor(formatScore(item.avg_otp_score))" />
                </v-row>
                <v-row class="ma-0 py-2">
                  On-Time Delivery
                  {{ formatScore(item.avg_otd_score) === '--' ? '--' : '' }}
                  <v-progress-linear v-if="formatScore(item.avg_otd_score) !== '--'"
                    :model-value="formatScore(item.avg_otd_score)" :color="getColor(formatScore(item.avg_otd_score))" />
                </v-row>
                <v-row class="ma-0 py-2">
                  Appointment Setting
                  {{ formatScore(item.avg_ltu_score) === '--' ? '--' : '' }}
                  <v-progress-linear v-if="formatScore(item.avg_ltu_score) !== '--'"
                    :model-value="formatScore(item.avg_ltu_score)" :color="getColor(formatScore(item.avg_ltu_score))" />
                </v-row>
                <v-row class="ma-0 py-2">
                  Pre-Book
                  {{ formatScore(item.avg_prebook_score) === '--' ? '--' : '' }}
                  <v-progress-linear v-if="formatScore(item.avg_prebook_score) !== '--'"
                    :model-value="formatScore(item.avg_prebook_score)"
                    :color="getColor(formatScore(item.avg_prebook_score))" />
                </v-row>
                <v-row class="ma-0 py-2">
                  Cost Performance
                  <InfoTooltip :tooltip_text="costPerformanceTooltip" />
                  <v-progress-linear :model-value="formatScore(item.avg_cost_score)"
                    :color="getColor(formatScore(item.avg_cost_score))" />
                </v-row>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6" class="justify-center">
                <v-col>
                  <v-row class="justify-center scorecardMetricValue">
                    {{ formatHoursToBusinessDays(item.avg_clt, 1) }}
                  </v-row>
                  <v-row class="justify-center font-weight-light">Avg. CLT</v-row>
                </v-col>
              </v-col>
              <v-col cols="6" class="justify-center">
                <v-col>
                  <v-row class="justify-center scorecardMetricValue">
                    {{ formatHoursToBusinessDays(item.avg_blt, 1) }}
                  </v-row>
                  <v-row class="justify-center font-weight-light">Avg. BLT</v-row>
                </v-col>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="justify-center">
                <v-col>
                  <v-row class="justify-center scorecardMetricValue">
                    {{ formatHoursToBusinessDays(item.avg_prebook, 1) }}
                  </v-row>
                  <v-row class="justify-center font-weight-light">Avg. Prebook</v-row>
                </v-col>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6" class="justify-center">
                <v-col>
                  <v-row class="justify-center scorecardMetricValue">
                    {{ formatPercent(item.avg_otp) }}
                  </v-row>
                  <v-row class="justify-center font-weight-light">OTP</v-row>
                </v-col>
              </v-col>
              <v-col cols="6" class="justify-center">
                <v-col>
                  <v-row class="justify-center scorecardMetricValue">
                    {{ formatPercent(item.avg_otd) }}
                  </v-row>
                  <v-row class="justify-center font-weight-light">OTD</v-row>
                </v-col>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>

    <!-- Simple formatted columns -->
    <template #item.customer_directs="{ item }">
      {{ formatCustomerDirect(item.customer_directs) }}
    </template>

    <template #item.equipmenttype="{ item }">
      {{ item.shipmentmode === 'IMDL' ? `IMDL - ${item.equipmenttype}` : item.equipmenttype }}
    </template>

    <template #item.total_margin="{ item }">{{ formatDollars(item.total_margin) }}</template>
    <template #item.avg_margin="{ item }">{{ formatPercent(item.avg_margin, 1) }}</template>
    <template #item.avg_margin_dollars="{ item }">{{ formatDollars(item.avg_margin_dollars) }}</template>
    <template #item.avg_clt="{ item }">{{ formatHoursToBusinessDays(item.avg_clt, 1, false) }}</template>
    <template #item.avg_blt="{ item }">{{ formatHoursToBusinessDays(item.avg_blt, 1, false) }}</template>
    <template #item.avg_prebook="{ item }">{{ formatHoursToBusinessDays(item.avg_prebook, 1, false) }}</template>
    <template #item.otp="{ item }">{{ formatPercent(item.otp) }}</template>
    <template #item.avg_otd="{ item }">{{ formatPercent(item.avg_otd) }}</template>
    <template #item.avg_revenue="{ item }">{{ formatDollars(item.avg_revenue) }}</template>
    <template #item.avg_miles="{ item }">{{ formatDecimal(item.avg_miles, 0) }}</template>
    <template #item.volume="{ item }">{{ formatNumber(item.volume) }}</template>

    <!-- Avg COGS column — shipper dashboard (plain) -->
    <template v-if="props.is_shipper_dashboard && !props.is_lane_data" #item.avg_cogs="{ item }">
      {{ formatDollars(item.avg_cogs) }}
    </template>

    <!-- Avg COGS column — with ML price popover -->
    <template v-else #item.avg_cogs="{ item }">
      <v-menu v-if="item.avg_ml_price != null" :close-on-content-click="false" :width="300" location="end"
        transition="scroll-x-transition">
        <template #activator="{ props: menuProps }">
          <v-chip class="truckCostShip pa-0 text-center" color="transparent"
            :style="`color: ${getPercentDifferenceColor(item.avg_ml_price, item.avg_cogs_wo_acc)}; font-weight: 450`"
            v-bind="menuProps">
            {{ formatDollars(item.avg_cogs) }}
          </v-chip>
        </template>
        <v-card class="pa-1">
          <v-card-text>
            <v-row>
              <v-col cols="6" class="justify-center">
                <v-col>
                  <v-row class="justify-center scorecardMetricValue">
                    {{ formatDollars(item.avg_cogs_wo_acc) }}
                  </v-row>
                  <v-row class="justify-center font-weight-light mt-3">
                    <v-tooltip location="bottom" max-width="320">
                      <template #activator="{ props: tipProps }">
                        <span v-bind="tipProps">Truck Cost*</span>
                      </template>
                      <span>
                        This truck cost removes accessorials and is the average truck cost of
                        shipments that have a TruceAI truck cost to compare against
                      </span>
                    </v-tooltip>
                  </v-row>
                </v-col>
              </v-col>
              <v-col cols="6" class="justify-center">
                <v-col>
                  <v-row class="justify-center scorecardMetricValue">
                    {{ formatDollars(item.avg_ml_price) }}
                  </v-row>
                  <v-row class="justify-center font-weight-light mt-3">TruceAI Truck Cost</v-row>
                </v-col>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="justify-center">
                <v-col>
                  <v-row class="justify-center scorecardMetricValue">
                    <span :style="`color: ${getPercentDifferenceColor(item.avg_ml_price, item.avg_cogs_wo_acc)}`">
                      {{ getPercentDifference(item.avg_ml_price, item.avg_cogs_wo_acc) }}
                    </span>
                  </v-row>
                  <v-row class="justify-center font-weight-light mt-3">Difference</v-row>
                </v-col>
              </v-col>
              <v-col cols="7" class="justify-center">
                <v-col>
                  <v-row class="justify-center scorecardMetricValue">
                    {{ formatNumber(item.avg_cogs_wo_acc_count) }}
                  </v-row>
                  <v-row class="justify-center font-weight-light mt-3">Benchmarked Shipments</v-row>
                </v-col>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-menu>

      <template v-else>
        <v-chip class="truckCostShip pa-0 text-center" color="transparent" disabled>
          {{ formatDollars(item.avg_cogs) }}
        </v-chip>
      </template>
    </template>

    <!-- ───────────────── EXPANDED ROW (shipments sub-table) ───────────────── -->
    <template v-if="!props.is_shipper_dashboard" #expanded-row="{ columns, item }">
      <td :colspan="columns.length" class="expandedTableCell">
        <v-data-table style="border-radius: 0px" :headers="headersShipment" :items="item.shipments"
          :sort-by="shipmentSortModel" class="expandedDataTableForShipments" v-model:page="page"
          @update:options="emitUpdatedOptionsShipments" :items-per-page="8" :items-per-page-options="[8, 15]"
          :items-length="item.shipment_row_count?.[0]?.count" :loading="isDropdownLoading"
          loading-text="Loading Data ...">
          <template #item.week="{ item: shipment }">
            {{ formatAggregationWeek(shipment.week) }}
          </template>
          <template #item.originCloseTime="{ item: shipment }">
            {{ formatDate(shipment.originCloseTime) }}
          </template>

          <!-- Shipment score — with breakdown popover -->
          <template v-if="formatScore(item.score) !== '--'" #item.score="{ item: shipment }">
            <v-menu :close-on-content-click="false" :width="220" location="end" transition="scroll-x-transition">
              <template #activator="{ props: menuProps }">
                <v-chip class="shipChip pa-0 text-center" variant="outlined" :color="getColor(shipment.score)"
                  :style="`color: ${getShipmentScoreChipColor()}`" v-bind="menuProps">
                  {{ formatScore(shipment.score) }}
                </v-chip>
              </template>
              <v-card class="pa-1">
                <v-card-title class="pb-0">Score Breakdown</v-card-title>
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12">
                      <v-row class="ma-0 py-2">
                        On-Time Pickup
                        {{ formatScore(shipment.otp_score) === '--' ? '--' : '' }}
                        <v-progress-linear v-if="formatScore(shipment.otp_score) !== '--'"
                          :model-value="formatScore(shipment.otp_score)"
                          :color="getColor(formatScore(shipment.otp_score))" />
                      </v-row>
                      <v-row class="ma-0 py-2">
                        On-Time Delivery
                        {{ formatScore(shipment.otd_score) === '--' ? '--' : '' }}
                        <v-progress-linear v-if="formatScore(shipment.otd_score) !== '--'"
                          :model-value="formatScore(shipment.otd_score)"
                          :color="getColor(formatScore(shipment.otd_score))" />
                      </v-row>
                      <v-row class="ma-0 py-2">
                        Appointment Setting
                        {{ formatScore(shipment.ltu_score) === '--' ? '--' : '' }}
                        <v-progress-linear v-if="formatScore(shipment.ltu_score) !== '--'"
                          :model-value="formatScore(shipment.ltu_score)"
                          :color="getColor(formatScore(shipment.ltu_score))" />
                      </v-row>
                      <v-row class="ma-0 py-2">
                        Pre-Book
                        {{ formatScore(shipment.prebook_score) === '--' ? '--' : '' }}
                        <v-progress-linear v-if="formatScore(shipment.prebook_score) !== '--'"
                          :model-value="formatScore(shipment.prebook_score)"
                          :color="getColor(formatScore(shipment.prebook_score))" />
                      </v-row>
                      <v-row class="ma-0 py-2">
                        Cost Performance
                        <InfoTooltip :tooltip_text="costPerformanceTooltip" />
                        <v-progress-linear :model-value="formatScore(shipment.cost_score)"
                          :color="getColor(formatScore(shipment.cost_score))" />
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6" class="justify-center">
                      <v-col>
                        <v-row class="justify-center scorecardMetricValue">
                          {{ formatHoursToBusinessDays(shipment.clt, 1) }}
                        </v-row>
                        <v-row class="justify-center font-weight-light">CLT</v-row>
                      </v-col>
                    </v-col>
                    <v-col cols="6" class="justify-center">
                      <v-col>
                        <v-row class="justify-center scorecardMetricValue">
                          {{ formatHoursToBusinessDays(shipment.blt, 1) }}
                        </v-row>
                        <v-row class="justify-center font-weight-light">BLT</v-row>
                      </v-col>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6" class="justify-center">
                      <v-col>
                        <v-row class="justify-center scorecardMetricValue">
                          {{ formatHoursToBusinessDays(shipment.prebook, 1) }}
                        </v-row>
                        <v-row class="justify-center font-weight-light">Prebook</v-row>
                      </v-col>
                    </v-col>
                    <v-col cols="6" class="justify-center">
                      <v-col>
                        <v-row class="justify-center scorecardMetricValue">
                          {{
                            formatOTD(shipment.destinationDelayMinutes) === '--'
                              ? formatOTD(shipment.destinationDelayMinutes)
                              : shipment.destinationDelayMinutes > 0
                                ? '0%'
                                : '100%'
                          }}
                        </v-row>
                        <v-row class="justify-center font-weight-light">OTD</v-row>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>

          <template v-else #item.score="{ item: shipment }">
            {{ formatScore(shipment.score) }}
          </template>

          <template #item.customer_direct="{ item: shipment }">
            {{ formatCustomerDirect(shipment.customer_direct) }}
          </template>
          <template #item.revenueTotal="{ item: shipment }">{{ formatDollars(shipment.revenueTotal) }}</template>
          <template #item.revenue="{ item: shipment }">{{ formatDollars(shipment.revenue) }}</template>
          <template #item.cogsTotal="{ item: shipment }">{{ formatDollars(shipment.cogsTotal) }}</template>

          <!-- Shipment COGS with ML price popover -->
          <template #item.cogs="{ item: shipment }">
            <v-menu v-if="shipment.ml_price != null" :close-on-content-click="false" :width="320" location="end"
              transition="scroll-x-transition">
              <template #activator="{ props: menuProps }">
                <v-chip class="truckCostShip pa-0 text-center" color="transparent"
                  :style="`color: ${getPercentDifferenceColor(shipment.ml_price, shipment.cogs_wo_acc)}; font-weight: 450`"
                  v-bind="menuProps">
                  {{ formatDollars(shipment.cogs) }}
                </v-chip>
              </template>
              <v-card class="pa-1">
                <v-card-text>
                  <v-row>
                    <v-col cols="4" class="justify-center">
                      <v-col>
                        <v-row class="justify-center scorecardMetricValue">
                          {{ formatDollars(shipment.cogs_wo_acc) }}
                        </v-row>
                        <v-row class="justify-center font-weight-light mt-3">
                          <v-tooltip location="bottom" max-width="320">
                            <template #activator="{ props: tipProps }">
                              <span v-bind="tipProps">Truck Cost*</span>
                            </template>
                            <span>Doesn't include accessorials</span>
                          </v-tooltip>
                        </v-row>
                      </v-col>
                    </v-col>
                    <v-col cols="5" class="justify-center">
                      <v-col>
                        <v-row class="justify-center scorecardMetricValue">
                          {{ formatDollars(shipment.ml_price) }}
                        </v-row>
                        <v-row class="justify-center font-weight-light mt-3">TruceAI Truck Cost</v-row>
                      </v-col>
                    </v-col>
                    <v-col cols="3" class="justify-center">
                      <v-col>
                        <v-row class="justify-center scorecardMetricValue">
                          <span :style="`color: ${getPercentDifferenceColor(shipment.ml_price, shipment.cogs_wo_acc)}`">
                            {{ getPercentDifference(shipment.ml_price, shipment.cogs_wo_acc) }}
                          </span>
                        </v-row>
                        <v-row class="justify-center font-weight-light mt-3">Difference</v-row>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-menu>

            <template v-else>
              <v-chip class="truckCostShip pa-0 text-center" color="transparent" disabled>
                {{ formatDollars(shipment.cogs) }}
              </v-chip>
            </template>
          </template>

          <template #item.margin="{ item: shipment }">{{ formatPercent(shipment.margin, 1) }}</template>
          <template #item.avg_margin="{ item: shipment }">{{ formatPercent(shipment.avg_margin, 1) }}</template>
          <template #item.margin_dollars="{ item: shipment }">{{ formatDollars(shipment.margin_dollars) }}</template>
          <template #item.avg_margin_dollars="{ item: shipment }">{{ formatDollars(shipment.avg_margin_dollars)
          }}</template>
          <template #item.clt="{ item: shipment }">{{ formatHoursToBusinessDays(shipment.clt, 1, false) }}</template>
          <template #item.blt="{ item: shipment }">{{ formatHoursToBusinessDays(shipment.blt, 1, false) }}</template>
          <template #item.prebook="{ item: shipment }">{{ formatHoursToBusinessDays(shipment.prebook, 1, false)
          }}</template>
          <template #item.preBook="{ item: shipment }">{{ formatHoursToBusinessDays(shipment.preBook, 1, false)
          }}</template>
          <template #item.distanceMiles="{ item: shipment }">{{ formatDecimal(shipment.distanceMiles, 2) }}</template>
          <template #item.miles="{ item: shipment }">{{ formatDecimal(shipment.miles, 2) }}</template>
          <template #item.avg_otd="{ item: shipment }">{{ formatPercent(shipment.avg_otd) }}</template>
          <template #item.volume="{ item: shipment }">{{ formatNumber(shipment.volume) }}</template>

          <!-- Destination delay -->
          <template #item.destinationDelayMinutes="{ item: shipment }">
            <template v-if="
              formatOTD(shipment.destinationDelayMinutes) > 0 ||
              (formatOTD(shipment.destinationDelayMinutes) === '--' && shipment.originDepartureTime == null) ||
              (formatOTD(shipment.destinationDelayMinutes) === '--' &&
                shipment.originDepartureTime != null &&
                shipment.destinationDepartureTime != null)
            ">
              {{ formatOTD(shipment.destinationDelayMinutes) }}
            </template>
            <template v-else-if="
              formatOTD(shipment.destinationDelayMinutes) === '--' &&
              shipment.originDepartureTime != null
            ">
              In Transit
            </template>
            <template v-else>
              <v-icon density="compact">mdi-clock-check-outline</v-icon>
            </template>
          </template>
        </v-data-table>
      </td>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { cloneDeep } from 'lodash'

import Tooltip from './Tooltip.vue'
import InfoTooltip from './InfoTooltip.vue'

import * as format from '../formatShipmentData'
import * as utils from '../utils'
import * as fetchAccountDetails from '../fetchAccountDetails'

import { useAppStore } from '@/stores/appStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  headers_array: {
    type: Array,
    default: () => [],
  },

  headers_shipments: {
    type: Array,
    default: () => [],
  },

  displayed_data: {
    type: Array,
    default: () => [],
  },

  percentToDollars: {
    type: Array,
    default: () => [],
  },

  is_shipper_dashboard: {
    type: Boolean,
    default: false,
  },

  is_lane_data: {
    type: Boolean,
    default: false,
  },

  server_items_length: {
    type: Number,
    default: 0,
  },

  server_items_length_shipments: {
    type: Number,
    default: 0,
  },

  show_select: {
    type: Boolean,
    default: false,
  },

  has_incomplete_score: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'dataTableOptionUpdate',
  'dataTableOptionUpdateShipments',
  'dataTableSelectionUpdate',
  'laneClick',
])

const router = useRouter()
const route = useRoute()
const vuetify = useTheme()
const store = useAppStore()

const headers = ref(props.headers_array)
const displayedData = ref(props.displayed_data)
const headersShipment = ref(props.headers_shipments)
const showSelect = computed(() => props.show_select)
const serverItemsLength = ref(props.server_items_length)
const isTableLoading = ref(false)
const isDropdownLoading = ref(false)
const isShipmentView = ref(true)

const expanded = ref([])
const expandedItem = ref(null)
const page = ref(1)
const selected = ref([])

const sortByModel = ref([{ key: 'volume', order: 'desc' }])
const shipmentSortModel = ref([
  {
    key: 'originCloseTime',
    order: 'desc',
  },
])

const costPerformanceTooltip = 'Cost against similar in-network shipments and consistency in truck cost'

const truncatedHeaders = computed(() => headers.value.slice(1))
const isBrokerUser = computed(() => store.role === 'broker')
const isAdminBroker = computed(() => store.role === 'broker' || store.role === 'admin')
const {
  favoriteLanes,
  email,
  brokerList,
  shipperList,
} = storeToRefs(store)

const currentTheme = computed(() => (vuetify.global.current.value.dark ? 'dark' : 'light'))

const itemKey = computed(() =>
  !props.is_lane_data.value
    ? isBrokerUser.value ? 'shipperId' : 'brokerId'
    : 'laneId'
)

const activeHeaders = computed(() =>
  !showSelect.value ? headers.value : truncatedHeaders.value
)

const tooltipHeaders = [
  'name', 'origin', 'destination', 'score', 'equipmenttype',
  'total_margin', 'avg_clt', 'avg_blt', 'avg_prebook',
  'otp', 'avg_otd', 'volume', 'avg_cogs', 'avg_revenue', 'avg_miles',
]

watch(
  () => props.percentToDollars,
  (val) => {
    if (!val?.length) return
    headers.value = val[0]
    headersShipment.value = val[1]
    displayedData.value = val[2]
    isShipmentView.value = val[3]
    serverItemsLength.value = val[4]
    isTableLoading.value = val[6]
    isDropdownLoading.value = val[7]
  },
  {
    deep: true,
    immediate: true
  }
)

watch(() => props.show_select, (val) => { showSelect.value = val })

const formatScore = format.formatScore
const formatPercent = format.formatPercent
const formatDollars = format.formatDollars
const formatDecimal = format.formatDecimal
const formatDate = format.formatDate
const formatHours = format.formatHours
const formatHoursToBusinessDays = format.formatHoursToBusinessDays
const formatAggregationWeek = format.formatAggregationWeek
const formatOTD = format.formatOTD
const formatNumber = format.formatNumber
const getColor = utils.getColor
const isDevEnv = utils.isDevEnv

function itemRowWidth(item) {
  return (item.origin || item.destination) ? 'originDestinationWidth' : undefined
}

function updatePageNumber(item) {
  expandedItem.value = item
  page.value = 1
}

function onRowClick(event, { item }) {
  if (!props.is_shipper_dashboard.value) return
  if (props.is_lane_data.value) rowClickLane(item)
  else if (!isBrokerUser.value) rowClickBroker(item)
  else rowClickShipper(item)
}

function getGotoDrilldownTooltip(item) {
  if (item.shipperId && isBrokerUser.value) return 'Shipper Drilldown'
  if (item.brokerId && !isBrokerUser.value) return 'Broker Drilldown'
  return 'Lane Drilldown'
}

function gotoItemDrilldown(item) {
  if(!props.is_shipper_dashboard) {
    if (item.shipperId && isBrokerUser.value){
      rowClickShipper(item)
    } else if (item.brokerId && !isBrokerUser.value) {
      rowClickBroker(item)
    } else rowClickLane(item, true)
  }
}

function rowClickBroker(value) {
  store.setBroker(value.brokerId)
  const urlName = value.name.replace(/ /g, '_')
  router.push({
    name: 'drilldown',
    query: { broker: urlName },
    params: {
      has_incomplete_score:
        formatScore(value.avg_carrier_score) === '--' ||
        formatScore(value.avg_broker_score) === '--',
    },
  })
}

function rowClickShipper(value) {
  store.setShipper(value.shipperId)
  const urlName = value.name.replace(/ /g, '_')
  router.push({ name: 'drilldown', query: { shipper: urlName } })
}

function rowClickLane(value, sendSBId = false) {
  store.setLane(value.laneId)
  emit('laneClick', {
    origin: value.origin,
    destination: value.destination,
    equipmenttype: value.equipmenttype,
    sb_id: sendSBId ? value.filterKeyIds : null,
  })
}

function emitUpdatedOptions(value) {
  emit('dataTableOptionUpdate', value)
}

function emitUpdatedOptionsShipments(value) {
  emit('dataTableOptionUpdateShipments', value)
}

function emitSelectedOptions(value) {
  emit('dataTableSelectionUpdate', value)
}

function showBadgeTooltip(carrier_score, broker_score, avg_load_creation_time) {
  const carrierBlank = formatScore(carrier_score) === '--'
  const brokerBlank = formatScore(broker_score) === '--' && avg_load_creation_time == null

  if (props.is_shipper_dashboard.value) return carrierBlank || brokerBlank
  if (carrierBlank || brokerBlank) {
    if (props.is_lane_data.value && !props.has_incomplete_score) return true
  }
  return false
}

function operationScoreFormatter(broker_score, avg_load_creation_time, customer_lead_time) {
  if (formatScore(broker_score) === '--' && avg_load_creation_time != null) {
    return formatHoursToBusinessDays(customer_lead_time, 1, false) < 1.5
      ? ' - Not enough lead time'
      : ' --'
  }
  if (formatScore(broker_score) === '--' && avg_load_creation_time == null) {
    return ' - Broker does not have this capability'
  }
  return ''
}

function operationScoreFormatterShipments(broker_score, customer_lead_time) {
  if (formatScore(broker_score) === '--') {
    return formatHoursToBusinessDays(customer_lead_time, 1, false) < 1.5
      ? ' - Not enough lead time'
      : ' --'
  }
  return ''
}

function formatCustomerDirect(customerNames) {
  return customerNames == null ? '' : customerNames.split(',').sort().join(', ')
}

function getShipmentScoreChipColor() {
  return currentTheme.value === 'light' ? 'black' : 'white'
}

function getPercentDifference(mlPrice, cogs) {
  const difference = cogs - mlPrice
  const average = (cogs + mlPrice) / 2
  return formatPercent(difference / average, 1)
}

function getPercentDifferenceColor(mlPrice, cogs) {
  const pct = ((cogs - mlPrice) / ((cogs + mlPrice) / 2)) * 100
  if (pct <= 1.9) return '#26892A'
  if (pct <= 4.9) return currentTheme.value === 'light' ? '#D17D3E' : 'rgba(255, 171, 108, 0.75)'
  return '#E53427'
}

function getDataStalenessTooltip(item) {
  const list = isBrokerUser.value ? shipperList.value : brokerList.value
  const key = isBrokerUser.value ? item.shipperId : item.brokerId
  const user = list?.find((e) => e.id === key)

  if (!user?.maxIngestionTime) return 'No data submitted'

  const diffDays = (Date.now() - new Date(user.maxIngestionTime).getTime()) / (1000 * 60 * 60 * 24)
  if (diffDays < 0) return 'Data last submitted 0 days ago'
  if (Math.ceil(diffDays) === 1) return 'Data last submitted 1 day ago'
  return `Data last submitted ${Math.ceil(diffDays)} days ago`
}

function getDataStalenessColor(item) {
  const list = isBrokerUser.value ? shipperList.value : brokerList.value
  const key = isBrokerUser.value ? item.shipperId : item.brokerId
  const user = list?.find((e) => e.id === key)

  if (!user?.maxIngestionTime) return 'grey'

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return new Date(user.maxIngestionTime).getTime() < weekAgo ? 'red' : 'green'
}

function showGotoItemDrilldown(item) {
  if (getGotoDrilldownTooltip(item) !== 'Lane Drilldown') {
    const brokerFromQuery = route.query?.broker
    const shipperFromQuery = route.query?.shipper
    if (brokerFromQuery) return brokerFromQuery !== item.name.replace(/ /g, '_')
    if (shipperFromQuery) return shipperFromQuery !== item.name.replace(/ /g, '_')
  }
  return true
}

function getFavoriteLanesParam(item) {
  const params = {}
  if (isBrokerUser.value) params.id = store.shipper
  else if (!isBrokerUser.value) params.id = store.broker
  else return params
  params.laneId = item.laneId
  return params
}

function isFavoriteLane(item) {
  const params = getFavoriteLanesParam(item)
  if (!params || !Object.keys(params).length) return false
  return (
    Object.keys(favoriteLanes.value).includes(params.id) &&
    favoriteLanes.value[params.id].includes(params.laneId)
  )
}

async function updateFavoriteLanes(item) {
  const params = getFavoriteLanesParam(item)
  if (!params || !Object.keys(params).length) return

  // Clone to avoid mutating the store directly
  const lanes = cloneDeep(favoriteLanes.value)

  if (isFavoriteLane(item)) {
    const idx = lanes[params.id].indexOf(params.laneId)
    lanes[params.id].splice(idx, 1)
  } else {
    if (!lanes[params.id]) lanes[params.id] = []
    lanes[params.id].push(params.laneId)
  }

  if (lanes[params.id]?.length === 0) delete lanes[params.id]

  store.setFavoriteLanes(lanes)

  // Persist to backend
    try {
      const result = await fetchAccountDetails.getAccountDetails({ email: email.value })
      let tempConfig = { favoriteLanes: lanes }

      if (result?.status === 200) {
        const cfg = result.data.records[0].config
        let data = null
        try {
          data = typeof cfg === 'string' ? JSON.parse(cfg) : cfg
        } catch (e) {
          console.warn('[DataTable] failed to parse config, using fallback', e)
          data = null
        }

        if (data) {
          data.favoriteLanes = lanes
          tempConfig = cloneDeep(data)
        }
      }

      await fetchAccountDetails.updateAccountDetails({
        email: email.value,
        config: 1,
        new_config: JSON.stringify(tempConfig),
      })
    } catch (err) {
      console.error('[DataTable] updateFavoriteLanes error:', err)
    }
}
</script>

<style lang="scss" scoped>
.dataTable .widthWrap {
  max-width: 100px;
  overflow-wrap: break-word !important;
  white-space: normal !important;
}

.expandedDataTableForShipments tbody tr:nth-of-type(even) {
  background-color: rgba(141, 140, 140, 0.05);
}

.gotoIcon {
  padding: 3px;
  border-radius: 50%;

  &:hover {
    color: #ffffff;
    background-color: #0091ff;
  }
}

.dataTable .goToWidthWrap {
  max-width: 30px;
  overflow-wrap: break-word !important;
  white-space: normal !important;
  padding-right: 0;
}

.originDestinationWidth {
  td:first-child {
    padding-left: 4px !important;
    padding-right: 4px !important;
    min-width: 70px !important;
  }

  td {
    max-width: 10rem !important;
  }
}

.shipChip {
  width: 40px;
  justify-content: center;
}

.truckCostShip {
  width: 50px;
  justify-content: center;
}

.scorecardMetricValue {
  font-weight: 400;
  font-size: 18px;
  /* Vuetify 3: use CSS custom properties */
  color: rgb(var(--v-theme-scorecardMetricColor));
}

.expandedTableCell {
  padding-right: 20px;
  padding-left: 20px;
  background-color: rgb(var(--v-theme-expandedTableCellColor));
}

/* Vuetify 3 row hover override */
.v-data-table__tr:hover td {
  background: #3f3f3f !important;
}
</style>
