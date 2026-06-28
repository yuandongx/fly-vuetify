<template>
  <v-sheet border class="mb-4 market-indices-sheet" rounded>
    <div class="indices-header">
      <h2 class="text-h6 font-weight-medium">
        <v-icon class="mr-2" icon="mdi-chart-line" />
        市场指数
      </h2>
      <v-chip color="primary" size="small" variant="tonal">
        <v-icon icon="mdi-refresh" size="x-small" start />
        每3秒更新
      </v-chip>
    </div>
    <v-slide-group class="px-4 pb-4 indices-carousel" show-arrows>
      <v-slide-group-item v-for="item in marketIndices" :key="item.code">
        <v-card
          :class="['ma-2 pa-4 rounded-xl index-card', item.change >= 0 ? 'rise-card' : 'fall-card']"
          min-width="180"
        >
          <div class="d-flex flex-column">
            <span class="text-body-2 font-weight-medium index-name">{{ item.name }}</span>
            <span class="text-h5 font-weight-bold index-price">{{ item.price.toFixed(2) }}</span>
            <div class="d-flex align-center mt-2">
              <v-icon class="mr-1" :icon="item.change >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'" size="small" />
              <span :class="['text-body-1 font-weight-bold', item.change >= 0 ? 'text-error' : 'text-success']">
                {{ formatChange(item.change, item.changePercent) }}
              </span>
            </div>
          </div>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { getIndicesList } from '@/http/indices'

  interface MarketIndex {
    code: string
    name: string
    price: number
    change: number
    changePercent: number
  }

  const marketIndices = ref<MarketIndex[]>([
    // { code: '000001', name: '上证指数', price: 3285.67, change: 45.23, changePercent: 1.4 },
    // { code: '399001', name: '深证成指', price: 10_855.32, change: 123.45, changePercent: 1.15 },
    // { code: '399006', name: '创业板指', price: 2156.78, change: -18.32, changePercent: -0.84 },
    // { code: '000688', name: '科创50', price: 1024.56, change: 8.76, changePercent: 0.86 },
    // { code: 'HSI', name: '恒生指数', price: 18_520, change: -125.3, changePercent: -0.67 },
    // { code: 'DJI', name: '道琼斯', price: 38_654.42, change: 245.18, changePercent: 0.64 },
    // { code: 'IXIC', name: '纳斯达克', price: 15_628.95, change: -85.32, changePercent: -0.54 },
    // { code: 'SPX', name: '标普500', price: 5021.84, change: 18.45, changePercent: 0.37 },
    // { code: 'N225', name: '日经225', price: 38_923.56, change: 312.78, changePercent: 0.81 },
    // { code: 'FTSE', name: '富时100', price: 7654.32, change: -45.67, changePercent: -0.59 },
  ])

  function getColor (change: number): string {
    return change >= 0 ? 'red-lighten-3' : 'green-lighten-3'
  }

  function formatChange (change: number, percent: number): string {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`
  }

  function updateIndices () {
    getIndicesList().then((response: any) => {
      console.log('Market Indices Response:', response)
      console.log('Market Indices total:', response.total)
      if (response.total > 0) {
        marketIndices.value = response.items.map((item: any) => ({
          code: item.code,
          name: item.name,
          price: Number(item.price),
          change: Number(item.change),
          changePercent: Number(item.change_pct),
        }))
      }
    }).catch((error: any) => {
      console.error('Error fetching market indices:', error)
    })
    
  }

  onMounted(() => {
    setInterval(updateIndices, 3000)
  })

  defineExpose({ marketIndices })
</script>

<style scoped>
.market-indices-sheet {
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.indices-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.indices-header h2 {
  color: white;
}

.indices-header .v-chip {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.indices-carousel :deep(.v-slide-group__prev),
.indices-carousel :deep(.v-slide-group__next) {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rise-card {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%);
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.fall-card {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.index-card {
  transition: all 0.3s ease;
}

.index-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.index-name {
  color: rgba(0, 0, 0, 0.6);
}

.index-price {
  font-variant-numeric: tabular-nums;
  color: rgba(0, 0, 0, 0.87);
}
</style>
