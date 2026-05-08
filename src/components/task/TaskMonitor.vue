<template>
  <div class="monitor-page">
    <v-sheet border rounded class="monitor-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="40" class="mr-3">
            <v-icon icon="mdi-book-multiple"></v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold">监控任务</div>
            <div class="text-caption text-grey">
              <v-icon icon="mdi-refresh" size="x-small" class="mr-1"></v-icon>
              每5秒自动刷新
            </div>
          </div>
        </div>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          rounded="lg"
          @click="add"
          class="add-btn"
        >
          新增任务
        </v-btn>
      </div>

      <v-divider></v-divider>

      <!-- 数据表格 -->
      <v-data-table-server
        :headers="headers"
        :items-length="dataItemsLength"
        :hide-default-footer="dataItemsLength < 11"
        :items="dataItems"
        :loading="loading"
        class="monitor-table"
      >
        <!-- 加载状态 -->
        <template #loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>

        <!-- 空状态 -->
        <template #no-data>
          <div class="d-flex flex-column align-center justify-center pa-8">
            <v-icon icon="mdi-clipboard-text-off-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
            <div class="text-h6 text-grey">暂无监控任务</div>
            <div class="text-body-2 text-grey-lighten-1 mt-2 mb-4">点击上方按钮创建第一个监控任务</div>
            <v-btn color="primary" variant="tonal" @click="add">
              <v-icon start icon="mdi-plus"></v-icon>
              新增任务
            </v-btn>
          </div>
        </template>

        <!-- 代码列 -->
        <template #item.code="{ item }">
          <v-chip size="small" variant="outlined" color="primary">
            {{ item.code }}
          </v-chip>
        </template>

        <!-- 名称列 -->
        <template #item.name="{ item }">
          <NameCell :value="item.name"></NameCell>
        </template>

        <!-- 现价列 -->
        <template #item.price="{ item }">
          <span class="price-cell">{{ formatPrice(item.price) }}</span>
        </template>

        <!-- 涨跌列 -->
        <template #item.chang_price="{ item }">
          <span :class="getChangeClass(item.chang_price)">
            {{ formatChange(item.chang_price) }}
          </span>
        </template>

        <!-- 涨跌幅列 -->
        <template #item.chang_percent="{ item }">
          <v-chip
            :color="getChangeChipColor(item.chang_percent)"
            size="small"
            variant="tonal"
          >
            {{ formatPercent(item.chang_percent) }}
          </v-chip>
        </template>

        <!-- 关注时价格 -->
        <template #item.start_price="{ item }">
          <span class="text-grey">¥{{ formatPrice(item.start_price) }}</span>
        </template>

        <!-- 关注时间 -->
        <template #item.start_date="{ item }">
          <span class="text-grey text-body-2">{{ item.start_date }}</span>
        </template>

        <!-- 提醒策略 -->
        <template #item.notice_rule="{ internalItem, isExpanded, toggleExpand }">
          <v-btn
            :append-icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            :text="isExpanded(internalItem) ? '收起' : '查看'"
            class="text-none expand-btn"
            variant="text"
            size="small"
            @click="toggleExpand(internalItem)"
          ></v-btn>
        </template>

        <!-- 展开行 -->
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length" class="expanded-cell">
              <v-sheet rounded="lg" border class="notice-sheet">
                <div class="notice-header">
                  <v-icon icon="mdi-bell-outline" size="small" class="mr-2"></v-icon>
                  <span class="text-subtitle-2">提醒配置</span>
                  <v-chip size="x-small" class="ml-2" color="primary" variant="tonal">
                    {{ item.notice_configs?.length || 0 }} 条
                  </v-chip>
                </div>
                <v-divider></v-divider>
                <v-table density="compact" class="notice-table">
                  <thead>
                    <tr>
                      <th>提醒类型</th>
                      <th>策略单位</th>
                      <th>阈值</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="config in item.notice_configs" :key="config.key || config.id">
                      <td>
                        <v-chip size="x-small" :color="getNoticeTypeColor(config.notice_type)" variant="tonal">
                          {{ getNoticeTypeLabel(config.notice_type) }}
                        </v-chip>
                      </td>
                      <td>{{ getNoticeUnitLabel(config.notice_unit) }}</td>
                      <td class="font-weight-bold">{{ config.notice_value }}{{ config.notice_unit === 'percent' ? '%' : '' }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-sheet>
            </td>
          </tr>
        </template>

        <!-- 操作列 -->
        <template #item.actions="{ item }">
          <TableActions :id="item.id" @edit="edit" @delete="remove"></TableActions>
        </template>
      </v-data-table-server>
    </v-sheet>

    <!-- 任务对话框 -->
    <TaskDialog
      v-model="dialog"
      :is-editing="isEditing"
      :form-data="formModel"
      :stock-items="selectItems"
      @save="save"
      @add-notice="addNoticeConfig"
      @remove-notice="removeNoticeConfig">
    </TaskDialog>

    <!-- 错误提示 -->
    <v-snackbar v-model="snackbar.show" color="error" timeout="3000">
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">关闭</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import { post, get } from '@/http/common'
import { monitorApi } from '@/http/api'

/**
 * 获取当前日期并格式化为 YYYY-MM-DD 格式
 */
const get_date = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function createNewRecord() {
  return {
    code: '',
    name: '',
    stock: null,
    noticeConfigs: [
      { noticeType: 'rise', noticeUnit: 'percent', noticeValue: 5 }
    ],
    start_date: get_date(),
    start_price: 0.0,
  }
}

const selectItems = ref([])
const dataItems = ref([])
const dataItemsLength = ref(0)
const loading = ref(false)
const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = ref(false)
const snackbar = ref({ show: false, text: '' })
let intervalId = undefined

const headers = [
  { title: '代码', key: 'code', align: 'start', width: '100px' },
  { title: '名称', key: 'name', width: '120px' },
  { title: '现价', key: 'price', width: '100px' },
  { title: '涨跌', key: 'chang_price', align: 'end', width: '100px' },
  { title: '涨跌幅', key: 'chang_percent', align: 'end', width: '100px' },
  { title: '提醒策略', key: 'notice_rule', align: 'end', width: '110px' },
  { title: '关注时价格', key: 'start_price', align: 'end', width: '110px' },
  { title: '关注时间', key: 'start_date', align: 'end', width: '110px' },
  { title: '操作', key: 'actions', align: 'end', sortable: false, width: '100px' },
]

// 格式化函数
const formatPrice = (price: number) => {
  if (price === null || price === undefined || isNaN(price)) return '-'
  return `¥${price.toFixed(2)}`
}

const formatChange = (change: number) => {
  if (change === null || change === undefined || isNaN(change)) return '-'
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}`
}

const formatPercent = (percent: number) => {
  if (percent === null || percent === undefined || isNaN(percent)) return '-'
  const sign = percent >= 0 ? '+' : ''
  return `${sign}${percent.toFixed(2)}%`
}

const getChangeClass = (value: number) => {
  if (value === null || value === undefined) return 'text-grey'
  if (value > 0) return 'text-error font-weight-bold'  // 上涨-红色
  if (value < 0) return 'text-success font-weight-bold' // 下跌-绿色
  return 'text-grey'
}

const getChangeChipColor = (value: number) => {
  if (value === null || value === undefined) return 'grey'
  return value > 0 ? 'error' : 'success'
}

const getNoticeTypeColor = (type: string) => {
  const map: Record<string, string> = { rise: 'error', fall: 'success' }
  return map[type] || 'grey'
}

const getNoticeTypeLabel = (type: string) => {
  const map: Record<string, string> = { rise: '上涨提醒', fall: '下跌提醒' }
  return map[type] || type
}

const getNoticeUnitLabel = (unit: string) => {
  const map: Record<string, string> = { percent: '百分比', price: '价格' }
  return map[unit] || unit
}

function add() {
  formModel.value = createNewRecord()
  isEditing.value = false
  dialog.value = true
}

function edit(id) {
  const found = dataItems.value.find(item => item.id === id)
  formModel.value = {
    ...found,
    stock: { code: found.code, name: found.name },
    noticeConfigs: found.noticeConfigs?.length
      ? [...found.noticeConfigs]
      : [...createNewRecord().noticeConfigs],
  }
  isEditing.value = true
  dialog.value = true
}

function remove(id) {
  const index = dataItems.value.findIndex(item => item.id === id)
  dataItems.value.splice(index, 1)
}

function save() {
  if (!formModel.value.stock) {
    snackbar.value = { show: true, text: '请选择股票/基金' }
    return
  }

  const submitData = {
    code: formModel.value.stock.code,
    name: formModel.value.stock.name,
    notice_configs: formModel.value.noticeConfigs.map((config, index) => ({
      id: `${index + 1}`,
      notice_type: config.noticeType,
      notice_unit: config.noticeUnit,
      notice_value: config.noticeValue,
    })),
    start_date: formModel.value.start_date,
    start_price: formModel.value.start_price,
  }

  if (formModel.value.id) {
    submitData.id = formModel.value.id
    const index = dataItems.value.findIndex(item => item.id === formModel.value.id)
    dataItems.value[index] = { ...formModel.value, ...submitData }
  } else {
    submitData.id = `${dataItems.value.length + 1}`
    dataItems.value.push({ ...formModel.value, ...submitData })
  }
  post(monitorApi.monitor, submitData)
}

function reset() {
  dialog.value = false
  formModel.value = createNewRecord()
}

function addNoticeConfig() {
  if (formModel.value.noticeConfigs.length < 3) {
    formModel.value.noticeConfigs.push({ noticeType: 'rise', noticeUnit: 'percent', noticeValue: 5 })
  }
}

function removeNoticeConfig(index) {
  if (formModel.value.noticeConfigs.length > 1) {
    formModel.value.noticeConfigs.splice(index, 1)
  }
}

const getDataItems = async () => {
  loading.value = true
  try {
    const data = await get(monitorApi.monitor)
    if (data.code == 0) {
      dataItems.value = data.data.items
      dataItemsLength.value = data.data.total
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

const getSelectItme = () => {
  return [
    { code: '000001', name: '平安银行' },
    { code: '000002', name: '万科A' },
    { code: '600000', name: '浦发银行' },
    { code: '600519', name: '贵州茅台' },
    { code: '000858', name: '五粮液' },
    { code: '159001', name: '货币基金A' },
    { code: '510300', name: '沪深300ETF' },
  ]
}

onMounted(() => {
  selectItems.value = getSelectItme()
  reset()
  getDataItems()
  intervalId = setInterval(() => {
    getDataItems()
  }, 5000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.monitor-page {
  padding: 16px;
}

.monitor-container {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.page-header .text-grey {
  color: rgba(255, 255, 255, 0.8) !important;
}

.add-btn {
  text-transform: none;
  font-weight: 600;
}

.monitor-table :deep(.v-data-table__thead) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.monitor-table :deep(.v-data-table__thead th) {
  font-weight: 600 !important;
  color: rgba(0, 0, 0, 0.7) !important;
  font-size: 0.875rem;
}

.monitor-table :deep(.v-data-table__tr) {
  transition: all 0.2s ease;
}

.monitor-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.price-cell {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.expand-btn {
  text-transform: none;
}

.expanded-cell {
  padding: 16px !important;
  background-color: #fafafa;
}

.notice-sheet {
  overflow: hidden;
}

.notice-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.notice-table {
  font-size: 0.875rem;
}

.notice-table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
