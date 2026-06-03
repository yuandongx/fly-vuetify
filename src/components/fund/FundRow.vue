<template>
  <tr class="fund-row" :class="{ 'is-favorite': isFavorite }">
    <td
      v-for="header in headers"
      :key="header.key"
      :class="getCellClass(header)"
    >
      <template v-if="header.key === 'name'">
        <div class="d-flex align-center ga-2">
          <v-icon class="fund-icon" color="primary" icon="mdi-piggybank-outline" size="small" />
          <div class="d-flex flex-column">
            <span class="fund-name">{{ item.name }}</span>
            <span class="text-caption text-grey">{{ item.code }}</span>
          </div>
        </div>
      </template>
      <template v-else-if="header.key === 'unit_net_value' || header.key === 'total_net_value'">
        <span class="value-label">{{ header.key === 'unit_net_value' ? '最新净值' : '累计净值' }}</span>
        <span class="value-value">{{ header.key === 'unit_net_value' ? '¥' : '' }}{{ formatValue(item[header.key]) }}</span>
      </template>
      <template v-else-if="isGrowthRateField(header.key)">
        <span :class="getChangeColorClass(item[header.key])">
          <v-icon
            v-if="header.key === 'day_growth_rate'"
            class="mr-1"
            :icon="getChangeIcon(item[header.key])"
            size="x-small"
          />
          {{ formatPercent(item[header.key]) }}
        </span>
      </template>
      <template v-else-if="header.key === 'fee'">
        <span>{{ formatPercent(item[header.key]) }}</span>
      </template>
      <template v-else-if="header.key === 'latest_scale'">
        <span class="text-grey">{{ formatScale(item[header.key]) }}</span>
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
          <v-tooltip activator="parent" location="top">
            更多操作
          </v-tooltip>
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

  const isFavorite = computed(() => {
    return props.item.follow === 1 || props.item.follow === '1'
  })

  /** 需要按百分比+颜色渲染的增长率字段 */
  const GROWTH_RATE_KEYS = new Set([
    'day_growth_rate',
    'week_growth_rate',
    'month_growth_rate',
    'quarter_growth_rate',
    'half_year_growth_rate',
    'year_growth_rate',
    'two_year_growth_rate',
    'three_year_growth_rate',
    'this_year_growth_rate',
    'total_growth_rate',
  ])

  function isGrowthRateField (key: string): boolean {
    return GROWTH_RATE_KEYS.has(key)
  }

  function parseValue (value: string | number | undefined | null): number | null {
    if (value === null || value === undefined || value === '') return null
    const num = typeof value === 'string' ? Number.parseFloat(value) : value
    return isNaN(num) ? null : num
  }

  function getChangeIcon (value: string | number | undefined | null) {
    const num = parseValue(value)
    if (num === null) return 'mdi-minus'
    if (num > 0) return 'mdi-trending-up'
    if (num < 0) return 'mdi-trending-down'
    return 'mdi-minus'
  }

  function getChangeColorClass (value: string | number | undefined | null) {
    const num = parseValue(value)
    if (num === null) return 'text-grey'
    if (num > 0) return 'text-error font-weight-bold'
    if (num < 0) return 'text-success font-weight-bold'
    return 'text-grey'
  }

  function formatValue (value: string | number | undefined | null) {
    if (value === null || value === undefined || value === '') return '-'
    const num = typeof value === 'string' ? Number.parseFloat(value) : value
    if (isNaN(num)) return '-'
    return num.toFixed(4)
  }

  function formatPercent (value: string | number | undefined | null) {
    if (value === null || value === undefined || value === '') return '-'
    const num = typeof value === 'string' ? Number.parseFloat(value) : value
    if (isNaN(num)) return '-'
    const sign = num >= 0 ? '+' : ''
    return `${sign}${num.toFixed(2)}%`
  }

  function formatScale (value: string | number | undefined | null) {
    const num = parseValue(value)
    if (num === null) return '-'
    if (num >= 10_000) return `${(num / 10_000).toFixed(2)}亿`
    if (num >= 1) return `${num.toFixed(2)}万`
    return num.toFixed(2)
  }

  function getCellClass (header: TableColumn) {
    const base: Record<string, string> = {
      code: 'text-center text-grey',
      name: 'text-left font-weight-medium',
      fund_type: 'text-center',
      date: 'text-center text-grey',
      day_growth_rate: 'text-right',
      week_growth_rate: 'text-right',
      month_growth_rate: 'text-right',
      quarter_growth_rate: 'text-right',
      half_year_growth_rate: 'text-right',
      year_growth_rate: 'text-right',
      two_year_growth_rate: 'text-right',
      three_year_growth_rate: 'text-right',
      this_year_growth_rate: 'text-right',
      total_growth_rate: 'text-right',
      unit_net_value: 'text-right',
      total_net_value: 'text-right',
      fee: 'text-right',
      latest_scale: 'text-right',
      track_index: 'text-center',
      update_time: 'text-center text-grey',
      established_time: 'text-center text-grey',
      fund_company: 'text-left',
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
