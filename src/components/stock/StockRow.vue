<template>
  <tr class="stock-row" :class="{ 'is-favorite': isFavorite }">
    <td
      v-for="header in headers"
      :key="header.key"
      :class="getCellClass(header)"
    >
      <template v-if="header.key === 'name'">
        <div class="d-flex align-center ga-2">
          <v-chip
            class="rank-chip"
            :color="getChangeColor(item.pricechange)"
            size="x-small"
            variant="tonal"
          >
            {{ getChangeLabel(item.pricechange) }}
          </v-chip>
          <span class="stock-name">{{ item.name }}</span>
        </div>
      </template>
      <template v-else-if="header.key === 'trade'">
        <span class="price-value">{{ formatPrice(item.trade) }}</span>
      </template>
      <template v-else-if="header.key === 'pricechange'">
        <span :class="getChangeColorClass(item.pricechange)">
          <v-icon
            v-if="header.arrow"
            class="mr-1"
            :icon="getChangeIcon(item.pricechange)"
            size="x-small"
          />
          {{ formatChange(item.pricechange) }}
        </span>
      </template>
      <template v-else-if="header.key === 'changepercent'">
        <span :class="getChangeColorClass(item.changepercent)">
          <v-icon
            v-if="header.arrow"
            class="mr-1"
            :icon="getChangeIcon(item.changepercent)"
            size="x-small"
          />
          {{ formatPercent(item.changepercent) }}
        </span>
      </template>
      <template v-else-if="header.key === 'volume'">
        <span class="text-grey">{{ formatVolume(item.volume) }}</span>
      </template>
      <template v-else-if="header.key === 'amount'">
        <span class="text-grey">{{ formatAmount(item.amount) }}</span>
      </template>
      <template v-else-if="header.key === 'turnoverratio'">
        <span>{{ formatPercent(item.turnoverratio) }}</span>
      </template>
      <template v-else>
        <span>{{ item[header.key] ?? '-' }}</span>
      </template>
    </td>
    <td class="text-right">
      <div class="d-flex ga-1 justify-end">
        <v-btn
          :color="isFavorite ? 'red' : 'grey'"
          icon
          size="small"
          variant="text"
          @click="onFavorite"
        >
          <v-icon :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'" size="20" />
          <v-tooltip activator="parent" location="top">
            {{ isFavorite ? '取消关注' : '添加关注' }}
          </v-tooltip>
        </v-btn>
        <v-btn
          color="grey"
          icon
          size="small"
          variant="text"
          @click="onMore"
        >
          <v-icon icon="mdi-dots-vertical" size="20" />
        </v-btn>
      </div>
    </td>
  </tr>
  <slot name="snack-bar" />
</template>

<script setup lang="ts">
  import type { TableColumn, TableRow } from '@/types/table'

  const props = defineProps({
    item: {
      type: Object as PropType<TableRow>,
      default: () => ({}),
    },
    headers: {
      type: Array as PropType<TableColumn[]>,
      default: () => [],
    },
    onHandleMore: {
      type: Function as PropType<(item: TableRow) => void>,
      default: () => {},
    },
    favorite: {
      type: Function as PropType<() => void>,
      default: () => {},
    },
  })

  // 统一解析数值为 number 或 null
  function parseValue (value: string | number | undefined | null): number | null {
    if (value === null || value === undefined || value === '') return null
    const num = typeof value === 'string' ? Number.parseFloat(value) : value
    return isNaN(num) ? null : num
  }

  const isFavorite = computed(() => {
    return props.item.follow === 1 || props.item.follow === '1'
  })

  // 获取涨跌图标
  function getChangeIcon (value: string | number | undefined | null) {
    const num = parseValue(value)
    if (num === null) return 'mdi-minus'
    return num >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'
  }

  function getChangeColor (value: string | number | undefined | null) {
    const num = parseValue(value)
    if (num === null) return 'grey'
    if (num > 0) return 'error'
    if (num < 0) return 'success'
    return 'grey'
  }

  function getChangeColorClass (value: string | number | undefined | null) {
    const num = parseValue(value)
    if (num === null) return 'text-grey'
    if (num > 0) return 'text-error font-weight-bold'
    if (num < 0) return 'text-success font-weight-bold'
    return 'text-grey'
  }

  function getChangeLabel (value: string | number | undefined | null) {
    const num = parseValue(value)
    if (num === null) return '平'
    if (num > 0) return '涨'
    if (num < 0) return '跌'
    return '平'
  }

  function formatPrice (price: string | number | undefined | null) {
    const num = parseValue(price)
    if (num === null) return '-'
    return `¥${num.toFixed(2)}`
  }

  function formatChange (change: string | number | undefined | null) {
    const num = parseValue(change)
    if (num === null) return '-'
    const sign = num >= 0 ? '+' : ''
    return `${sign}${num.toFixed(2)}`
  }

  function formatPercent (percent: string | number | undefined | null) {
    const num = parseValue(percent)
    if (num === null) return '-'
    const sign = num >= 0 ? '+' : ''
    return `${sign}${num.toFixed(2)}%`
  }

  function formatVolume (volume: string | number | undefined | null) {
    const num = parseValue(volume)
    if (num === null) return '-'
    if (num >= 100_000_000) return `${(num / 100_000_000).toFixed(2)}亿`
    if (num >= 10_000) return `${(num / 10_000).toFixed(2)}万`
    return num.toFixed(0)
  }

  function formatAmount (amount: string | number | undefined | null) {
    const num = parseValue(amount)
    if (num === null) return '-'
    if (num >= 100_000_000) return `${(num / 100_000_000).toFixed(2)}亿`
    if (num >= 10_000) return `${(num / 10_000).toFixed(2)}万`
    return num.toFixed(2)
  }

  function getCellClass (header: TableColumn) {
    const base: Record<string, string> = {
      symbol: 'text-center text-grey',
      name: 'text-left font-weight-medium',
      trade: 'text-right',
      pricechange: 'text-right',
      changepercent: 'text-right',
      high: 'text-right',
      low: 'text-right',
      open: 'text-right',
      settlement: 'text-right',
      volume: 'text-right text-grey',
      amount: 'text-right text-grey',
      turnoverratio: 'text-right',
      ticktime: 'text-right text-grey',
    }
    return base[header.key] || 'text-right'
  }

  function onFavorite () {
    props.favorite()
  }

  function onMore () {
    props.onHandleMore(props.item)
  }
</script>

<style scoped>
.stock-row {
  transition: all 0.2s ease;
  cursor: pointer;
}

.stock-row:hover {
  background-color: rgba(102, 126, 234, 0.06) !important;
  transform: translateX(4px);
}

.stock-row.is-favorite {
  background-color: rgba(244, 67, 54, 0.04);
}

.stock-name {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}

.rank-chip {
  font-weight: 700;
  min-width: 32px;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.price-value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
</style>
