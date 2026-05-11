<template>
  <tr class="fund-row" :class="{ 'is-favorite': isFavorite }">
    <td class="text-left font-weight-medium">
      <div class="d-flex align-center ga-2">
        <v-icon icon="mdi-piggybank-outline" size="small" color="primary" class="fund-icon"></v-icon>
        <div class="d-flex flex-column">
          <span class="fund-name">{{ item.name }}</span>
          <span class="text-caption text-grey">{{ item.code }}</span>
        </div>
      </div>
    </td>
    <td class="text-right">
      <span class="value-label">最新净值</span>
      <span class="value-value">¥{{ formatValue(item.netValue) }}</span>
    </td>
    <td class="text-right">
      <span class="value-label">累计净值</span>
      <span class="value-value">{{ formatValue(item.totalNetValue) }}</span>
    </td>
    <td class="text-right" :class="getChangeColorClass(item.dayGrowth)">
      <v-icon
        :icon="getChangeIcon(item.dayGrowth)"
        size="x-small"
        class="mr-1"
      ></v-icon>
      {{ formatPercent(item.dayGrowth) }}
    </td>
    <td class="text-right">
      <span class="value-label">近1月</span>
      <span :class="getChangeColorClass(item.month1)">{{ formatPercent(item.month1) }}</span>
    </td>
    <td class="text-right">
      <span class="value-label">近3月</span>
      <span :class="getChangeColorClass(item.month3)">{{ formatPercent(item.month3) }}</span>
    </td>
    <td class="text-right">
      <span class="value-label">近1年</span>
      <span :class="getChangeColorClass(item.year1)">{{ formatPercent(item.year1) }}</span>
    </td>
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
          <v-tooltip activator="parent" location="top">
            更多操作
          </v-tooltip>
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

const isFavorite = computed(() => {
  return props.item.follow === 1 || props.item.follow === '1'
})

const parseValue = (value: string | number | undefined | null): number | null => {
  if (value === null || value === undefined || value === '') return null
  const num = typeof value === 'string' ? parseFloat(value) : value
  return isNaN(num) ? null : num
}

const getChangeIcon = (value: string | number | undefined | null) => {
  const num = parseValue(value)
  if (num === null) return 'mdi-minus'
  if (num > 0) return 'mdi-trending-up'
  if (num < 0) return 'mdi-trending-down'
  return 'mdi-minus'
}

const getChangeColorClass = (value: string | number | undefined | null) => {
  const num = parseValue(value)
  if (num === null) return 'text-grey'
  if (num > 0) return 'text-error font-weight-bold'
  if (num < 0) return 'text-success font-weight-bold'
  return 'text-grey'
}

const formatValue = (value: string | number | undefined | null) => {
  if (value === null || value === undefined || value === '') return '-'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '-'
  return num.toFixed(4)
}

const formatPercent = (value: string | number | undefined | null) => {
  if (value === null || value === undefined || value === '') return '-'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '-'
  const sign = num >= 0 ? '+' : ''
  return `${sign}${num.toFixed(2)}%`
}

const onFavorite = () => {
  props.favorite()
}

const onMore = () => {
  props.onHandleMore(props.item)
}
</script>

<style scoped>
.fund-row {
  transition: all 0.2s ease;
  cursor: pointer;
}

.fund-row:hover {
  background-color: rgba(17, 153, 142, 0.06) !important;
  transform: translateX(4px);
}

.fund-row.is-favorite {
  background-color: rgba(244, 67, 54, 0.04);
}

.fund-icon {
  opacity: 0.9;
}

.fund-name {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
  line-height: 1.2;
}

.value-label {
  display: block;
  font-size: 0.7rem;
  color: #9e9e9e;
  line-height: 1.2;
  margin-bottom: 2px;
}

.value-value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: rgba(0, 0, 0, 0.87);
}
</style>
