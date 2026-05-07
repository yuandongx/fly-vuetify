<template>
  <v-sheet border rounded class="mb-4">
    <div class="d-flex align-center justify-space-between pa-4">
      <h2 class="text-h6 font-weight-medium">
        <v-icon icon="mdi-chart-line" class="mr-2"></v-icon>
        市场指数
      </h2>
    </div>
    <v-slide-group show-arrows class="px-4 pb-4">
      <v-slide-group-item v-for="item in marketIndices" :key="item.code">
        <v-card
          :color="getColor(item.change)"
          class="ma-2 pa-3 rounded-lg index-card"
          min-width="180"
        >
          <div class="d-flex flex-column">
            <span class="text-body-2 font-weight-medium text-white">{{ item.name }}</span>
            <span class="text-h5 font-weight-bold text-white">{{ item.price.toFixed(2) }}</span>
            <div class="d-flex align-center mt-1">
              <v-icon :icon="item.change >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'" size="small" class="mr-1"></v-icon>
              <span class="text-body-1 font-weight-bold text-white">{{ formatChange(item.change, item.changePercent) }}</span>
            </div>
          </div>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface MarketIndex {
  code: string
  name: string
  price: number
  change: number
  changePercent: number
}

const marketIndices = ref<MarketIndex[]>([
  { code: '000001', name: '上证指数', price: 3285.67, change: 45.23, changePercent: 1.40 },
  { code: '399001', name: '深证成指', price: 10855.32, change: 123.45, changePercent: 1.15 },
  { code: '399006', name: '创业板指', price: 2156.78, change: -18.32, changePercent: -0.84 },
  { code: '000688', name: '科创50', price: 1024.56, change: 8.76, changePercent: 0.86 },
  { code: 'HSI', name: '恒生指数', price: 18520.00, change: -125.30, changePercent: -0.67 },
  { code: 'DJI', name: '道琼斯', price: 38654.42, change: 245.18, changePercent: 0.64 },
  { code: 'IXIC', name: '纳斯达克', price: 15628.95, change: -85.32, changePercent: -0.54 },
  { code: 'SPX', name: '标普500', price: 5021.84, change: 18.45, changePercent: 0.37 },
  { code: 'N225', name: '日经225', price: 38923.56, change: 312.78, changePercent: 0.81 },
  { code: 'FTSE', name: '富时100', price: 7654.32, change: -45.67, changePercent: -0.59 },
])

function getColor(change: number): string {
  return change >= 0 ? 'red-lighten-3' : 'green-lighten-3'
}

function formatChange(change: number, percent: number): string {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`
}

function updateIndices() {
  marketIndices.value = marketIndices.value.map(index => ({
    ...index,
    changePercent: index.changePercent + (Math.random() - 0.5) * 0.1,
    change: index.change + (Math.random() - 0.5) * 2,
    price: index.price + (Math.random() - 0.5) * 5
  }))
}

onMounted(() => {
  setInterval(updateIndices, 3000)
})

defineExpose({ marketIndices })
</script>

<style scoped>
.index-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.index-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
