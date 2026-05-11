<template>
  <div class="task-page">
    <!-- 自定义头部 -->
    <div class="table-header">
      <div class="header-content">
        <div class="d-flex align-center flex-wrap ga-6 filter-controls">
          <!-- 搜索框 -->
          <v-text-field
            v-model="searchValue"
            class="search-field"
            clearable
            density="comfortable"
            hide-details
            :loading="loading"
            placeholder="搜索任务名称/接口名..."
            prepend-inner-icon="mdi-magnify"
            style="min-width: 260px; max-width: 340px"
            variant="solo-filled"
            rounded="lg"
            @click:clear="onClear"
            @keyup.enter="onSearch"
          />

          <!-- 状态筛选 -->
          <v-select
            v-model="statusFilter"
            class="filter-select"
            clearable
            density="comfortable"
            hide-details
            :items="statusOptions"
            label="状态"
            style="min-width: 120px; max-width: 160px"
            variant="solo-filled"
            rounded="lg"
          />

          <!-- 触发方式筛选 -->
          <v-select
            v-model="triggerFilter"
            class="filter-select"
            clearable
            density="comfortable"
            hide-details
            :items="triggerOptions"
            label="触发方式"
            style="min-width: 120px; max-width: 160px"
            variant="solo-filled"
            rounded="lg"
          />
        </div>
        <div class="header-stats">
          <v-chip color="primary" size="comfortable" variant="tonal" rounded="pill">
            <v-icon icon="mdi-refresh" size="x-small" start />
            自动刷新
          </v-chip>
        </div>
      </div>
    </div>

    <v-sheet border class="task-container">
      <!-- 数据表格 -->
      <v-data-table-server
        class="task-table"
        :headers="headers"
        :items="tasks"
        :items-length="tasks_length"
        :loading="loading"
        :options="tableOptions"
      >
        <!-- 加载状态 -->
        <template #loading>
          <v-skeleton-loader type="table-row@5" />
        </template>

        <!-- 空状态 -->
        <template #no-data>
          <div class="d-flex flex-column align-center justify-center pa-8">
            <v-icon class="mb-4" color="grey-lighten-1" icon="mdi-robot-off-outline" size="64" />
            <div class="text-h6 text-grey">暂无任务记录</div>
            <div class="text-body-2 text-grey-lighten-1 mt-2">等待任务执行...</div>
          </div>
        </template>

        <!-- 任务名称 -->
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" :color="getTaskIconColor(item)" :icon="getTaskIcon(item)" size="small" />
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
            <v-icon :icon="getStatusIcon(item.status)" size="x-small" start />
            {{ item.status }}
          </v-chip>
        </template>

        <!-- 触发方式 -->
        <template #item.trigger="{ item }">
          <v-chip color="grey" size="x-small" variant="outlined">
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
            <v-icon class="mr-1 text-success" icon="mdi-play" size="x-small" />
            {{ formatTime(item.start_time) }}
          </div>
        </template>

        <!-- 持续时间 -->
        <template #item.duration="{ item }">
          <span class="duration-badge">
            <v-icon class="mr-1" icon="mdi-timer-outline" size="x-small" />
            {{ formatDuration(item.duration) }}
          </span>
        </template>

        <!-- 操作按钮 -->
        <template #item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
          <div class="d-flex ga-1">
            <v-btn
              color="primary"
              icon
              size="x-small"
              variant="text"
              @click.stop="refreshTask(internalItem)"
            >
              <v-icon icon="mdi-refresh" size="18" />
              <v-tooltip activator="parent" location="top">刷新</v-tooltip>
            </v-btn>
            <v-menu location="bottom end">
              <template #activator="{ props }">
                <v-btn
                  color="grey"
                  icon
                  size="x-small"
                  variant="text"
                  v-bind="props"
                >
                  <v-icon icon="mdi-dots-vertical" size="18" />
                </v-btn>
              </template>
              <v-list class="action-menu" density="compact">
                <v-list-item @click="toggleExpand(internalItem)">
                  <template #prepend>
                    <v-icon icon="mdi-history" size="small" />
                  </template>
                  <v-list-item-title>查看历史</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template #prepend>
                    <v-icon icon="mdi-pencil" size="small" />
                  </template>
                  <v-list-item-title>编辑任务</v-list-item-title>
                </v-list-item>
                <v-divider class="my-1" />
                <v-list-item class="text-error">
                  <template #prepend>
                    <v-icon color="error" icon="mdi-delete" size="small" />
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
            <td class="expanded-cell" :colspan="columns.length">
              <task-table-history-row :row-data="get_history(item)" />
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
              density="compact"
              :length="Math.ceil(tasks_length / 10)"
              rounded="circle"
              :total-visible="5"
            />
          </div>
        </template>
      </v-data-table-server>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
  import type { Params } from '@/types/common'
  import type { Task, TaskHistory } from '@/types/task'
  import { watch } from 'vue'
  import { monitorApi } from '@/http/api'
  import { get } from '@/http/common'
  import { columns } from '@/vars/task'

  let intervalId: number | null = null
  const loading = ref(true)
  const tasks = ref<Task[]>([])
  const tasks_length = ref(0)
  const currentPage = ref(1)
  const headers = [...columns, { id: 9999, key: 'data-table-expand', title: '操作', sortable: false, align: 'end' as const }]

  // 搜索和筛选
  const searchValue = ref('')
  const statusFilter = ref<string | null>(null)
  const triggerFilter = ref<string | null>(null)

  const statusOptions = [
    { title: '成功', value: 'success' },
    { title: '失败', value: 'failed' },
    { title: '运行中', value: 'running' },
    { title: '等待中', value: 'pending' },
  ]

  const triggerOptions = [
    { title: '手动', value: 'manual' },
    { title: '定时', value: 'scheduled' },
    { title: 'Webhook', value: 'webhook' },
  ]

  const parms: Params = reactive({
    page: '1',
    page_size: '10',
  })

  // 搜索和筛选处理
  function onSearch () {
    parms.search = searchValue.value
    get_data()
  }

  function onClear () {
    searchValue.value = ''
    parms.search = ''
    get_data()
  }

  // 监听筛选条件变化
  watch([statusFilter, triggerFilter], ([newStatus, newTrigger]) => {
    parms.status = newStatus || undefined
    parms.trigger = newTrigger || undefined
    get_data()
  })

  function map_data (data: Array<any>): Array<Task> {
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
      histories: item.histories || [],
    }))
  }

  function get_data () {
    loading.value = true
    get(monitorApi.list, parms).then(response => {
      tasks.value = map_data(response.data.data)
      tasks_length.value = response.data.total
    }).catch(error => {
      console.error('获取任务数据失败:', error)
    }).finally(() => {
      loading.value = false
    })
  }

  function tableOptions ({ page, itemsPerPage, sortBy }: any) {
    parms.page = String(page || 1)
    parms.page_size = String(itemsPerPage || 10)
    if (sortBy?.length) {
      parms.sort = sortBy[0].key
      parms.order = sortBy[0].order
    }
    get_data()
  }

  function refreshTask (item: any) {
    console.log('刷新任务:', item)
    get_data()
  }

  function get_history (item: any): TaskHistory[] {
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
        error: historyItem.error,
      })
    })
    return rows
  }

  // 格式化函数
  function getTaskIcon (item: Task) {
    if (item.status === 'running') return 'mdi-loading mdi-spin'
    if (item.error) return 'mdi-alert-circle'
    return 'mdi-check-circle'
  }

  function getTaskIconColor (item: Task) {
    if (item.status === 'running') return 'info'
    if (item.error) return 'error'
    return 'success'
  }

  function getStatusColor (status: string) {
    const map: Record<string, string> = {
      success: 'success',
      failed: 'error',
      running: 'info',
      pending: 'warning',
    }
    return map[status?.toLowerCase()] || 'grey'
  }

  function getStatusIcon (status: string) {
    const map: Record<string, string> = {
      success: 'mdi-check-circle',
      failed: 'mdi-alert-circle',
      running: 'mdi-loading mdi-spin',
      pending: 'mdi-clock-outline',
    }
    return map[status?.toLowerCase()] || 'mdi-help-circle'
  }

  function formatTrigger (trigger: string) {
    const map: Record<string, string> = {
      manual: '手动',
      scheduled: '定时',
      webhook: 'Webhook',
    }
    return map[trigger] || trigger || '-'
  }

  function formatTime (time: string) {
    if (!time) return '-'
    return time.replace('T', ' ').slice(0, 19)
  }

  function formatDuration (ms: number) {
    if (!ms) return '-'
    if (ms < 1000) return `${ms}ms`
    if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60_000).toFixed(1)}min`
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

.table-header {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  padding: 16px 20px;
  border-radius: 12px 12px 0 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.filter-controls {
  margin-left: -8px;
}

.header-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-stats .v-chip {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.search-field,
.filter-select {
  font-size: 14px;
}

.search-field :deep(.v-field),
.filter-select :deep(.v-field) {
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.search-field :deep(.v-field:hover),
.filter-select :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.search-field :deep(.v-field__input),
.filter-select :deep(.v-field__input) {
  padding-top: 10px;
  padding-bottom: 10px;
}

.task-container {
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: white;
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
  background-color: rgba(245, 158, 11, 0.06) !important;
  transform: translateX(2px);
}

.time-cell {
  font-variant-numeric: tabular-nums;
  font-size: 0.875rem;
}

.duration-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 6px;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  color: #d97706;
}

.interface-code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.8rem;
  padding: 4px 8px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.action-menu {
  min-width: 160px;
  border-radius: 12px;
  overflow: hidden;
}

.expanded-cell {
  padding: 16px !important;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
}
</style>
