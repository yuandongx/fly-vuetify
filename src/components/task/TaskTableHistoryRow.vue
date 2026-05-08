<template>
  <v-sheet rounded="lg" border class="history-container">
    <div class="history-header">
      <v-icon icon="mdi-history" size="small" class="mr-2"></v-icon>
      <span class="text-subtitle-2">执行历史</span>
      <v-chip size="x-small" class="ml-2" color="primary" variant="tonal">
        {{ rowData.length }} 条记录
      </v-chip>
    </div>
    <v-divider></v-divider>
    <v-table density="compact" class="history-table">
      <thead>
        <tr>
          <th v-for="header in historyColumns" :key="header.id">{{ header.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rowData" :key="row.id" class="history-row">
          <td v-for="header in historyColumns" :key="header.id">
            <span v-if="header.key === 'status'">
              <v-chip :color="getStatusColor(row.status)" size="x-small" variant="tonal">
                <v-icon start :icon="getStatusIcon(row.status)" size="x-small"></v-icon>
                {{ row.status }}
              </v-chip>
            </span>
            <span v-else-if="header.key === 'duration'" class="duration-cell">
              <v-icon icon="mdi-timer-outline" size="x-small" class="mr-1"></v-icon>
              {{ formatDuration(row.duration) }}
            </span>
            <span v-else-if="header.key === 'error'" :class="row.error ? 'text-error' : ''">
              {{ row.error || '-' }}
            </span>
            <span v-else>{{ getValue(row, header.key) }}</span>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
</template>

<script setup lang="ts">
import { historyColumns } from '@/vars/task'
import type { TaskHistory } from '@/types/task'

const props = defineProps({
  rowData: {
    type: Array<TaskHistory>,
    required: true
  }
})

function getValue(row: TaskHistory, key: string) {
  return (row as any)[key]
}

function getStatusColor(status: string) {
  const statusMap: Record<string, string> = {
    'success': 'success',
    'failed': 'error',
    'running': 'info',
    'pending': 'warning',
  }
  return statusMap[status?.toLowerCase()] || 'grey'
}

function getStatusIcon(status: string) {
  const iconMap: Record<string, string> = {
    'success': 'mdi-check-circle',
    'failed': 'mdi-alert-circle',
    'running': 'mdi-loading mdi-spin',
    'pending': 'mdi-clock-outline',
  }
  return iconMap[status?.toLowerCase()] || 'mdi-help-circle'
}

function formatDuration(ms: number) {
  if (!ms) return '-'
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}min`
}
</script>

<style scoped>
.history-container {
  margin: 8px 0;
  overflow: hidden;
}

.history-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.history-table {
  font-size: 0.875rem;
}

.history-row {
  transition: background-color 0.2s ease;
}

.history-row:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.duration-cell {
  font-variant-numeric: tabular-nums;
  color: rgba(0, 0, 0, 0.7);
}
</style>
