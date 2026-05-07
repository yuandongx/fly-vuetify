<template>
  <v-row>
    <!-- 涨幅榜 -->
    <v-col cols="12" md="6">
      <v-sheet border rounded class="h-100">
        <div class="d-flex align-center justify-space-between pa-4">
          <h3 class="text-subtitle-1 font-weight-medium text-red-darken-2">
            <v-icon icon="mdi-trending-up" class="mr-1"></v-icon>
            涨幅榜 TOP10
          </h3>
        </div>
        <v-divider></v-divider>
        <v-table density="compact" class="ranking-table">
          <thead>
            <tr>
              <th class="text-left text-caption">名称</th>
              <th class="text-center text-caption">代码</th>
              <th class="text-right text-caption">最新价</th>
              <th class="text-right text-caption">涨跌幅</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in riseRanking" :key="item.code" class="rise-row">
              <td class="py-2">
                <v-chip :color="getRiseColor(item.changePercent)" size="small" variant="tonal">
                  {{ index + 1 }}
                </v-chip>
                <span class="ml-2">{{ item.name }}</span>
              </td>
              <td class="text-center text-caption">{{ item.code }}</td>
              <td class="text-right">{{ item.price.toFixed(2) }}</td>
              <td class="text-right text-red font-weight-bold">
                +{{ item.changePercent.toFixed(2) }}%
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
    </v-col>

    <!-- 跌幅榜 -->
    <v-col cols="12" md="6">
      <v-sheet border rounded class="h-100">
        <div class="d-flex align-center justify-space-between pa-4">
          <h3 class="text-subtitle-1 font-weight-medium text-green-darken-2">
            <v-icon icon="mdi-trending-down" class="mr-1"></v-icon>
            跌幅榜 TOP10
          </h3>
        </div>
        <v-divider></v-divider>
        <v-table density="compact" class="ranking-table">
          <thead>
            <tr>
              <th class="text-left text-caption">名称</th>
              <th class="text-center text-caption">代码</th>
              <th class="text-right text-caption">最新价</th>
              <th class="text-right text-caption">涨跌幅</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in fallRanking" :key="item.code" class="fall-row">
              <td class="py-2">
                <v-chip :color="getFallColor(item.changePercent)" size="small" variant="tonal">
                  {{ index + 1 }}
                </v-chip>
                <span class="ml-2">{{ item.name }}</span>
              </td>
              <td class="text-center text-caption">{{ item.code }}</td>
              <td class="text-right">{{ item.price.toFixed(2) }}</td>
              <td class="text-right text-green font-weight-bold">
                {{ item.changePercent.toFixed(2) }}%
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface StockItem {
  code: string
  name: string
  price: number
  change: number
  changePercent: number
}

const allStocks = ref<StockItem[]>([
  { code: '000001', name: '平安银行', price: 12.56, change: 1.23, changePercent: 10.85 },
  { code: '000002', name: '万科A', price: 8.45, change: 0.76, changePercent: 9.88 },
  { code: '600519', name: '贵州茅台', price: 1680.00, change: 152.00, changePercent: 9.95 },
  { code: '000858', name: '五粮液', price: 158.32, change: 12.45, changePercent: 8.54 },
  { code: '600036', name: '招商银行', price: 35.67, change: 2.45, changePercent: 7.38 },
  { code: '601318', name: '中国平安', price: 48.90, change: 3.12, changePercent: 6.82 },
  { code: '000333', name: '美的集团', price: 62.34, change: 3.89, changePercent: 6.65 },
  { code: '300750', name: '宁德时代', price: 178.90, change: 10.23, changePercent: 6.07 },
  { code: '600276', name: '恒瑞医药', price: 52.18, change: 2.89, changePercent: 5.86 },
  { code: '002475', name: '立讯精密', price: 28.45, change: 1.54, changePercent: 5.72 },
  { code: '000002', name: '万科A', price: 7.69, change: -0.76, changePercent: -8.99 },
  { code: '600010', name: '包钢股份', price: 1.89, change: -0.18, changePercent: -8.70 },
  { code: '601166', name: '兴业银行', price: 15.67, change: -1.34, changePercent: -7.88 },
  { code: '002594', name: '比亚迪', price: 198.32, change: -15.67, changePercent: -7.32 },
  { code: '600028', name: '中国石化', price: 5.45, change: -0.38, changePercent: -6.52 },
  { code: '601288', name: '农业银行', price: 3.45, change: -0.23, changePercent: -6.25 },
  { code: '601988', name: '中国银行', price: 3.89, change: -0.24, changePercent: -5.81 },
  { code: '000001', name: '平安银行', price: 11.33, change: -0.67, changePercent: -5.58 },
  { code: '601398', name: '工商银行', price: 4.56, change: -0.25, changePercent: -5.20 },
  { code: '601328', name: '交通银行', price: 5.12, change: -0.26, changePercent: -4.83 },
])

const riseRanking = ref<StockItem[]>([])
const fallRanking = ref<StockItem[]>([])

function getRiseColor(percent: number): string {
  if (percent >= 9) return 'red-darken-2'
  if (percent >= 5) return 'red'
  return 'red-lighten-1'
}

function getFallColor(percent: number): string {
  if (percent <= -9) return 'green-darken-2'
  if (percent <= -5) return 'green'
  return 'green-lighten-1'
}

function updateRanking() {
  const sorted = [...allStocks.value].sort((a, b) => b.changePercent - a.changePercent)
  riseRanking.value = sorted.slice(0, 10)
  fallRanking.value = sorted.slice(-10).reverse()
}

onMounted(() => {
  updateRanking()
  setInterval(() => {
    allStocks.value = allStocks.value.map(stock => ({
      ...stock,
      changePercent: stock.changePercent + (Math.random() - 0.5) * 0.5
    }))
    updateRanking()
  }, 3000)
})

defineExpose({ riseRanking, fallRanking })
</script>

<style scoped>
.ranking-table {
  font-size: 0.875rem;
}

.rise-row:hover,
.fall-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
