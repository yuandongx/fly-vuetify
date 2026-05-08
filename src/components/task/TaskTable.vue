<template>
  <div class="task-page">
    <v-sheet border rounded class="task-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="d-flex align-center">
          <v-avatar color="info" size="40" class="mr-3">
            <v-icon icon="mdi-robot"></v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold">任务运行记录</div>
            <div class="text-caption text-grey">
              <v-icon icon="mdi-refresh" size="x-small" class="mr-1"></v-icon>
              自动刷新中
            </div>
          </div>
        </div>
        <div class="d-flex align-center ga-3">
          <v-chip size="small" color="primary" variant="tonal">
            <v-icon start icon="mdi-counter" size="x-small"></v-icon>
            共 {{ tasks_length }} 条
          </v-chip>
        </div>
      </div>

      <v-divider></v-divider>

      <!-- 数据表格 -->
      <v-data-table-server
        :headers="headers"
        :items="tasks"
        :options="tableOptions"
        :loading="loading"
        :items-length="tasks_length"
        class="task-table"
      >
        <!-- 加载状态 -->
        <template #loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>

        <!-- 空状态 -->
        <template #no-data>
          <div class="d-flex flex-column align-center justify-center pa-8">
            <v-icon icon="mdi-robot-off-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
            <div class="text-h6 text-grey">暂无任务记录</div>
            <div class="text-body-2 text-grey-lighten-1 mt-2">等待任务执行...</div>
          </div>
        </template>

        <!-- 任务名称 -->
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <v-icon :icon="getTaskIcon(item)" :color="getTaskIconColor(item)" size="small" class="mr-2"></v-icon>
            <span class="font-weight-medium">{{ item.name }}</span>
          </div>
        </template>

        <!-- 状态 -->
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            variant="tonal"
          >
            <v-icon start :icon="getStatusIcon(item.status)" size="x-small"></v-icon>
            {{ item.status }}
          </v-chip>
        </template>

        <!-- 触发方式 -->
        <template #item.trigger="{ item }">
          <v-chip size="x-small" variant="outlined" color="grey">
            {{ formatTrigger(item.trigger) }}
          </v-chip>
        </template>

        <!-- 接口名 -->
        <template #item.interface_name="{ item }">
          <code class="interface-code">{{ item.interface_name }}</code>
        </template>

        <!-- 运行时间 -->
        <template #item.start_time="{ item }">
          <div class="time-cell">
            <v-icon icon="mdi-play" size="x-small" class="mr-1 text-success"></v-icon>
            {{ formatTime(item.start_time) }}
          </div>
        </template>

        <!-- 持续时间 -->
        <template #item.duration="{ item }">
          <span class="duration-badge">
            <v-icon icon="mdi-timer-outline" size="x-small" class="mr-1"></v-icon>
            {{ formatDuration(item.duration) }}
          </span>
        </template>

        <!-- 操作按钮 -->
        <template #item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
          <div class="d-flex ga-1">
            <v-btn
              icon
              variant="text"
              size="x-small"
              color="primary"
              @click.stop="refreshTask(internalItem)"
            >
              <v-icon icon="mdi-refresh" size="18"></v-icon>
              <v-tooltip activator="parent" location="top">刷新</v-tooltip>
            </v-btn>
            <v-menu location="bottom end">
              <template #activator="{ props }">
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  color="grey"
                  v-bind="props"
                >
                  <v-icon icon="mdi-dots-vertical" size="18"></v-icon>
                </v-btn>
              </template>
              <v-list density="compact" class="action-menu">
                <v-list-item @click="toggleExpand(internalItem)">
                  <template #prepend>
                    <v-icon icon="mdi-history" size="small"></v-icon>
                  </template>
                  <v-list-item-title>查看历史</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template #prepend>
                    <v-icon icon="mdi-pencil" size="small"></v-icon>
                  </template>
                  <v-list-item-title>编辑任务</v-list-item-title>
                </v-list-item>
                <v-divider class="my-1"></v-divider>
                <v-list-item class="text-error">
                  <template #prepend>
                    <v-icon icon="mdi-delete" size="small" color="error"></v-icon>
                  </template>
                  <v-list-item-title>删除</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>

        <!-- 展开行 - 历史记录 -->
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length" class="expanded-cell">
              <task-table-history-row :rowData="get_history(item)" />
            </td>
          </tr>
        </template>

        <!-- 底部 -->
        <template #bottom>
          <div class="d-flex align-center justify-space-between pa-4 border-t">
            <div class="text-body-2 text-grey">
              显示 {{ tasks.length }} 条记录
            </div>
            <v-pagination
              v-model="currentPage"
              :length="Math.ceil(tasks_length / 10)"
              :total-visible="5"
              density="compact"
              rounded="circle"
            ></v-pagination>
          </div>
        </template>
      </v-data-table-server>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { columns } from '@/vars/task'
import { get } from '@/http/common'
import { monitorApi } from '@/http/api'
import type { Params } from '@/types/common'
import type { TaskHistory, Task } from '@/types/task'

let intervalId: number | null = null
const loading = ref(true)
const tasks = ref<Task[]>([])
const tasks_length = ref(0)
const currentPage = ref(1)
const headers = [...columns, { id: 9999, key: 'data-table-expand', title: '操作', sortable: false, align: 'end' as const }]

const parms: Params = {
  page: '1',
  page_size: '10'
}

const map_data = (data: Array<any>): Array<Task> => {
  return data.map((item: any) => ({
    _id: item._id,
    id: item.id,
    name: item.name,
    desc: item.msg,
    start_time: item.start_time,
    end_time: item.end_time,
    next_time: item.next_time,
    duration: item.duration,
    status: item.status,
    error: item.error,
    interface_name: item.interface_name,
    collection: item.collection,
    trigger: item.trigger,
    msg: item.msg,
    histories: item.histories || []
  }))
}

const get_data = () => {
  loading.value = true
  get(monitorApi.list, parms).then((response) => {
    tasks.value = map_data(response.data.data)
    tasks_length.value = response.data.total
  }).catch((error) => {
    console.error('获取任务数据失败:', error)
  }).finally(() => {
    loading.value = false
  })
}

const tableOptions = ({ page, itemsPerPage, sortBy, search }: any) => {
  // 处理分页和排序
}

const refreshTask = (item: any) => {
  console.log('刷新任务:', item)
  get_data()
}

const get_history = (item: any): TaskHistory[] => {
  const rows: TaskHistory[] = []
  let count = 0
  item.histories?.forEach((historyItem: any) => {
    count += 1
    rows.push({
      id: `${item.id}_history_${count}`,
      name: historyItem.name,
      desc: historyItem.desc,
      start_time: historyItem.start_time,
      end_time: historyItem.end_time,
      duration: historyItem.duration,
      status: historyItem.status,
      error: historyItem.error
    })
  })
  return rows
}

// 格式化函数
const getTaskIcon = (item: Task) => {
  if (item.status === 'running') return 'mdi-loading mdi-spin'
  if (item.error) return 'mdi-alert-circle'
  return 'mdi-check-circle'
}

const getTaskIconColor = (item: Task) => {
  if (item.status === 'running') return 'info'
  if (item.error) return 'error'
  return 'success'
}

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    success: 'success',
    failed: 'error',
    running: 'info',
    pending: 'warning',
  }
  return map[status?.toLowerCase()] || 'grey'
}

const getStatusIcon = (status: string) => {
  const map: Record<string, string> = {
    success: 'mdi-check-circle',
    failed: 'mdi-alert-circle',
    running: 'mdi-loading mdi-spin',
    pending: 'mdi-clock-outline',
  }
  return map[status?.toLowerCase()] || 'mdi-help-circle'
}

const formatTrigger = (trigger: string) => {
  const map: Record<string, string> = {
    manual: '手动',
    scheduled: '定时',
    webhook: 'Webhook',
  }
  return map[trigger] || trigger || '-'
}

const formatTime = (time: string) => {
  if (!time) return '-'
  return time.replace('T', ' ').substring(0, 19)
}

const formatDuration = (ms: number) => {
  if (!ms) return '-'
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}min`
}

// 初始化
onMounted(() => {
  get_data()
  intervalId = setInterval(() => {
    get_data()
  }, 5000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.task-page {
  padding: 16px;
}

.task-container {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.page-header .text-grey {
  color: rgba(255, 255, 255, 0.8) !important;
}

.task-table :deep(.v-data-table__thead) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.task-table :deep(.v-data-table__thead th) {
  font-weight: 600 !important;
  color: rgba(0, 0, 0, 0.7) !important;
  font-size: 0.875rem;
}

.task-table :deep(.v-data-table__tr) {
  transition: all 0.2s ease;
}

.task-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}

.time-cell {
  font-variant-numeric: tabular-nums;
  font-size: 0.875rem;
}

.duration-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

.interface-code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.8rem;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 4px;
}

.action-menu {
  min-width: 160px;
  border-radius: 8px;
}

.expanded-cell {
  padding: 16px !important;
  background-color: #fafafa;
}
</style>
