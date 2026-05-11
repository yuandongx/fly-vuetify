<template>
  <tr class="stock-row" :class="{ 'is-favorite': isFavorite }">
    <td class="text-left font-weight-medium">
      <div class="d-flex align-center ga-2">
        <v-chip
          :color="getChangeColor(item.change)"
          size="x-small"
          variant="tonal"
          class="rank-chip"
        >
          {{ getChangeLabel(item.change) }}
        </v-chip>
        <span class="stock-name">{{ item.name }}</span>
      </div>
    </td>
    <td class="text-center text-grey">{{ item.code }}</td>
    <td class="text-right">
      <span class="price-value">{{ formatPrice(item.price) }}</span>
    </td>
    <td class="text-right" :class="getChangeColorClass(item.change)">
      <v-icon
        :icon="getChangeIcon(item.change)"
        size="x-small"
        class="mr-1"
      ></v-icon>
      {{ formatChange(item.change) }}
    </td>
    <td class="text-right">
      <span :class="getChangeColorClass(item.changePercent)">
        {{ formatPercent(item.changePercent) }}
      </span>
    </td>
    <td class="text-right text-grey">{{ formatVolume(item.volume) }}</td>
    <td class="text-right">
      <div class="d-flex ga-1 justify-end">
        <v-btn
          icon
          variant="text"
          size="small"
          :color="isFavorite ? 'red' : 'grey'"
          @click="onFavorite"
        >
          <v-icon :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'" size="20"></v-icon>
          <v-tooltip activator="parent" location="top">
            {{ isFavorite ? '取消关注' : '添加关注' }}
          </v-tooltip>
        </v-btn>
        <v-btn
          icon
          variant="text"
          size="small"
          color="grey"
          @click="onMore"
        >
          <v-icon icon="mdi-dots-vertical" size="20"></v-icon>
        </v-btn>
      </div>
    </td>
  </tr>
  <slot name="snack-bar"></slot>
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
const parseValue = (value: string | number | undefined | null): number | null => {
  if (value === null || value === undefined || value === '') return null
  const num = typeof value === 'string' ? parseFloat(value) : value
  return isNaN(num) ? null : num
}

const isFavorite = computed(() => {
  return props.item.follow === 1 || props.item.follow === '1'
})

// 获取涨跌图标
const getChangeIcon = (value: string | number | undefined | null) => {
  const num = parseValue(value)
  if (num === null) return 'mdi-minus'
  return num >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'
}

const getChangeColor = (value: string | number | undefined | null) => {
  const num = parseValue(value)
  if (num === null) return 'grey'
  if (num > 0) return 'error'
  if (num < 0) return 'success'
  return 'grey'
}

const getChangeColorClass = (value: string | number | undefined | null) => {
  const num = parseValue(value)
  if (num === null) return 'text-grey'
  if (num > 0) return 'text-error font-weight-bold'
  if (num < 0) return 'text-success font-weight-bold'
  return 'text-grey'
}

const getChangeLabel = (value: string | number | undefined | null) => {
  const num = parseValue(value)
  if (num === null) return '平'
  if (num > 0) return '涨'
  if (num < 0) return '跌'
  return '平'
}

const formatPrice = (price: string | number | undefined | null) => {
  const num = parseValue(price)
  if (num === null) return '-'
  return `¥${num.toFixed(2)}`
}

const formatChange = (change: string | number | undefined | null) => {
  const num = parseValue(change)
  if (num === null) return '-'
  const sign = num >= 0 ? '+' : ''
  return `${sign}${num.toFixed(2)}`
}

const formatPercent = (percent: string | number | undefined | null) => {
  const num = parseValue(percent)
  if (num === null) return '-'
  const sign = num >= 0 ? '+' : ''
  return `${sign}${num.toFixed(2)}%`
}

const formatVolume = (volume: string | number | undefined | null) => {
  const num = parseValue(volume)
  if (num === null) return '-'
  if (num >= 100000000) return `${(num / 100000000).toFixed(2)}亿`
  if (num >= 10000) return `${(num / 10000).toFixed(2)}万`
  return num.toFixed(0)
}

const onFavorite = () => {
  props.favorite()
}

const onMore = () => {
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
