<template>
  <div class="note-page">
    <!-- 自定义头部 -->
    <div class="table-header">
      <div class="header-content">
        <div class="d-flex align-center flex-wrap ga-4">
          <!-- 搜索框 -->
          <v-text-field
            v-model="searchValue"
            density="compact"
            placeholder="搜索代码/名称..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            class="search-field"
            style="max-width: 200px"
            clearable
            @click:clear="searchValue = ''"
          ></v-text-field>

          <!-- 类型筛选 -->
          <v-select
            v-model="typeFilter"
            :items="typeOptions"
            density="compact"
            variant="outlined"
            hide-details
            class="filter-select"
            style="max-width: 120px"
            label="类型"
            clearable
          ></v-select>

          <!-- 状态筛选 -->
          <v-select
            v-model="statusFilter"
            :items="statusOptions"
            density="compact"
            variant="outlined"
            hide-details
            class="filter-select"
            style="max-width: 120px"
            label="状态"
            clearable
          ></v-select>
        </div>
        <div class="header-actions">
          <v-btn color="white" variant="flat" @click="openDialog()">
            <v-icon start icon="mdi-plus"></v-icon>
            新增记录
          </v-btn>
        </div>
      </div>
    </div>

    <v-sheet border class="note-container">
      <!-- 数据表格 -->
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :items-length="filteredItems.length"
        :loading="loading"
        class="note-table"
        item-value="id"
      >
        <!-- 加载状态 -->
        <template #loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>

        <!-- 空状态 -->
        <template #no-data>
          <div class="d-flex flex-column align-center justify-center pa-8">
            <v-icon icon="mdi-notebook-off-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
            <div class="text-h6 text-grey">暂无交易记录</div>
            <div class="text-body-2 text-grey-lighten-1 mt-2 mb-4">点击上方按钮添加第一笔交易记录</div>
            <v-btn color="primary" variant="tonal" @click="openDialog()">
              <v-icon start icon="mdi-plus"></v-icon>
              新增记录
            </v-btn>
          </div>
        </template>

        <!-- 类型 -->
        <template #item.type="{ item }">
          <v-chip :color="item.type === 'stock' ? 'info' : 'purple'" size="small" variant="tonal">
            <v-icon start :icon="item.type === 'stock' ? 'mdi-trending-up' : 'mdi-chart-line'" size="x-small"></v-icon>
            {{ item.type === 'stock' ? '股票' : '基金' }}
          </v-chip>
        </template>

        <!-- 代码 -->
        <template #item.code="{ item }">
          <v-chip size="small" variant="outlined" color="primary">
            {{ item.code }}
          </v-chip>
        </template>

        <!-- 名称 -->
        <template #item.name="{ item }">
          <span class="font-weight-medium">{{ item.name }}</span>
        </template>

        <!-- 数额 -->
        <template #item.amount="{ item }">
          <span class="font-weight-bold">{{ item.amount }}</span>
          <span class="text-grey text-caption">股</span>
        </template>

        <!-- 买入价 -->
        <template #item.buyPrice="{ item }">
          <span class="text-error">¥{{ formatNumber(item.buyPrice) }}</span>
        </template>

        <!-- 卖出价 -->
        <template #item.sellPrice="{ item }">
          <span v-if="item.sellPrice" class="text-success">¥{{ formatNumber(item.sellPrice) }}</span>
          <span v-else class="text-grey">-</span>
        </template>

        <!-- 手续费 -->
        <template #item.fee="{ item }">
          <span class="text-grey">¥{{ formatNumber(item.fee) }}</span>
        </template>

        <!-- 买入时间 -->
        <template #item.buyDate="{ item }">
          <span class="text-body-2">{{ item.buyDate }}</span>
        </template>

        <!-- 卖出时间 -->
        <template #item.sellDate="{ item }">
          <span v-if="item.sellDate" class="text-body-2">{{ item.sellDate }}</span>
          <span v-else class="text-grey">-</span>
        </template>

        <!-- 当前价 -->
        <template #item.currentPrice="{ item }">
          <span v-if="item.currentPrice" class="font-weight-bold">¥{{ formatNumber(item.currentPrice) }}</span>
          <span v-else class="text-grey">-</span>
        </template>

        <!-- 盈亏金额 -->
        <template #item.profit="{ item }">
          <span v-if="item.profit !== undefined" :class="getProfitClass(item)">
            {{ item.profit >= 0 ? '+' : '' }}¥{{ formatNumber(Math.abs(item.profit)) }}
          </span>
          <span v-else class="text-grey">-</span>
        </template>

        <!-- 盈亏比例 -->
        <template #item.profitRate="{ item }">
          <v-chip
            v-if="item.profitRate !== undefined"
            :color="getProfitRateColor(item.profitRate)"
            size="small"
            variant="tonal"
          >
            {{ item.profitRate >= 0 ? '+' : '' }}{{ item.profitRate.toFixed(2) }}%
          </v-chip>
          <span v-else class="text-grey">-</span>
        </template>

        <!-- 操作 -->
        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-btn icon variant="text" size="x-small" color="primary" @click="openDialog(item)">
              <v-icon icon="mdi-pencil" size="18"></v-icon>
              <v-tooltip activator="parent" location="top">编辑</v-tooltip>
            </v-btn>
            <v-btn icon variant="text" size="x-small" color="error" @click="handleDelete(item)">
              <v-icon icon="mdi-delete" size="18"></v-icon>
              <v-tooltip activator="parent" location="top">删除</v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-sheet>

    <!-- 统计卡片 -->
    <v-row class="mt-4" dense>
      <v-col cols="12" sm="6" md="3">
        <v-sheet border rounded-lg class="pa-4 stats-card stats-card-1">
          <div class="d-flex align-center">
            <v-avatar color="rgba(139, 92, 246, 0.1)" size="48">
              <v-icon icon="mdi-currency-usd" color="purple"></v-icon>
            </v-avatar>
            <div class="ml-3">
              <div class="text-caption text-grey">总盈亏</div>
              <div class="text-h6 font-weight-bold" :class="totalProfit >= 0 ? 'text-success' : 'text-error'">
                {{ totalProfit >= 0 ? '+' : '' }}¥{{ formatNumber(Math.abs(totalProfit)) }}
              </div>
            </div>
          </div>
        </v-sheet>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-sheet border rounded-lg class="pa-4 stats-card stats-card-2">
          <div class="d-flex align-center">
            <v-avatar color="rgba(59, 130, 246, 0.1)" size="48">
              <v-icon icon="mdi-chart-line" color="blue"></v-icon>
            </v-avatar>
            <div class="ml-3">
              <div class="text-caption text-grey">总交易额</div>
              <div class="text-h6 font-weight-bold">¥{{ formatNumber(totalAmount) }}</div>
            </div>
          </div>
        </v-sheet>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-sheet border rounded-lg class="pa-4 stats-card stats-card-3">
          <div class="d-flex align-center">
            <v-avatar color="rgba(34, 197, 94, 0.1)" size="48">
              <v-icon icon="mdi-trending-up" color="success"></v-icon>
            </v-avatar>
            <div class="ml-3">
              <div class="text-caption text-grey">盈利次数</div>
              <div class="text-h6 font-weight-bold text-success">{{ profitCount }}</div>
            </div>
          </div>
        </v-sheet>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-sheet border rounded-lg class="pa-4 stats-card stats-card-4">
          <div class="d-flex align-center">
            <v-avatar color="rgba(239, 68, 68, 0.1)" size="48">
              <v-icon icon="mdi-trending-down" color="error"></v-icon>
            </v-avatar>
            <div class="ml-3">
              <div class="text-caption text-grey">亏损次数</div>
              <div class="text-h6 font-weight-bold text-error">{{ lossCount }}</div>
            </div>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- 新增/编辑对话框 -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card class="note-dialog">
        <div class="dialog-header">
          <div class="d-flex align-center">
            <v-icon :icon="isEditing ? 'mdi-pencil-circle' : 'mdi-plus-circle'" :color="isEditing ? 'primary' : 'success'" class="mr-3"></v-icon>
            <div>
              <div class="text-h6">{{ isEditing ? '编辑' : '新增' }}交易记录</div>
              <div class="text-caption text-grey-lighten-3">{{ isEditing ? '修改交易信息' : '添加新的交易记录' }}</div>
            </div>
          </div>
          <v-btn icon variant="text" size="small" @click="dialog = false">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </div>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-form ref="formRef" v-model="formValid">
            <v-row dense>
              <!-- 类型 -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.type"
                  :items="typeOptions"
                  label="交易类型"
                  variant="outlined"
                  density="compact"
                  :rules="[v => !!v || '请选择类型']"
                >
                  <template #prepend-inner>
                    <v-icon icon="mdi-tag" size="small" class="mr-2"></v-icon>
                  </template>
                </v-select>
              </v-col>

              <!-- 代码 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.code"
                  label="代码"
                  variant="outlined"
                  density="compact"
                  placeholder="如: 600519"
                  :rules="[v => !!v || '请输入代码']"
                >
                  <template #prepend-inner>
                    <v-icon icon="mdi-barcode" size="small" class="mr-2"></v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- 名称 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.name"
                  label="名称"
                  variant="outlined"
                  density="compact"
                  placeholder="如: 贵州茅台"
                  :rules="[v => !!v || '请输入名称']"
                >
                  <template #prepend-inner>
                    <v-icon icon="mdi-account" size="small" class="mr-2"></v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- 数额 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="formData.amount"
                  label="数额(股)"
                  variant="outlined"
                  density="compact"
                  type="number"
                  placeholder="买入/卖出的股数"
                  :rules="[v => !!v || '请输入数额']"
                >
                  <template #prepend-inner>
                    <v-icon icon="mdi-numeric" size="small" class="mr-2"></v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- 买入价 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="formData.buyPrice"
                  label="买入价"
                  variant="outlined"
                  density="compact"
                  type="number"
                  step="0.01"
                  placeholder="买入时的价格"
                  :rules="[v => v > 0 || '请输入买入价']"
                >
                  <template #prepend-inner>
                    <v-icon icon="mdi-currency-cny" size="small" class="mr-2"></v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- 卖出价 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="formData.sellPrice"
                  label="卖出价"
                  variant="outlined"
                  density="compact"
                  type="number"
                  step="0.01"
                  placeholder="卖出时的价格(可选)"
                  clearable
                >
                  <template #prepend-inner>
                    <v-icon icon="mdi-cash" size="small" class="mr-2"></v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- 手续费 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="formData.fee"
                  label="手续费"
                  variant="outlined"
                  density="compact"
                  type="number"
                  step="0.01"
                  placeholder="交易手续费"
                  :rules="[v => v >= 0 || '手续费不能为负']"
                >
                  <template #prepend-inner>
                    <v-icon icon="mdi-credit-card" size="small" class="mr-2"></v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- 当前价 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="formData.currentPrice"
                  label="当前价"
                  variant="outlined"
                  density="compact"
                  type="number"
                  step="0.01"
                  placeholder="当前市场价格(可选)"
                  clearable
                >
                  <template #prepend-inner>
                    <v-icon icon="mdi-cash-multiple" size="small" class="mr-2"></v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- 买入时间 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.buyDate"
                  label="买入时间"
                  variant="outlined"
                  density="compact"
                  type="date"
                  :rules="[v => !!v || '请选择买入时间']"
                >
                  <template #prepend-inner>
                    <v-icon icon="mdi-calendar" size="small" class="mr-2"></v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- 卖出时间 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.sellDate"
                  label="卖出时间"
                  variant="outlined"
                  density="compact"
                  type="date"
                >
                  <template #prepend-inner>
                    <v-icon icon="mdi-calendar-check" size="small" class="mr-2"></v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="dialog = false">
            <v-icon start icon="mdi-close"></v-icon>
            取消
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" :disabled="!formValid" @click="handleSave">
            <v-icon start icon="mdi-check"></v-icon>
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <div class="dialog-header-delete">
          <v-icon icon="mdi-alert-circle" color="error" size="32"></v-icon>
          <div class="text-h6 ml-3">确认删除</div>
        </div>
        <v-card-text class="pa-6 text-center">
          确定要删除这条交易记录吗？此操作不可恢复。
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="deleteDialog = false">取消</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="flat" @click="confirmDelete">删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 提示 -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">关闭</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// 类型定义
interface TradeRecord {
  id: string
  type: 'stock' | 'fund'
  code: string
  name: string
  amount: number
  buyPrice: number
  sellPrice?: number
  fee: number
  buyDate: string
  sellDate?: string
  currentPrice?: number
  profit?: number
  profitRate?: number
}

// 表格配置
const headers = [
  { title: '类型', key: 'type', width: '90px' },
  { title: '代码', key: 'code', width: '100px' },
  { title: '名称', key: 'name', width: '120px' },
  { title: '数额', key: 'amount', width: '80px', align: 'end' as const },
  { title: '买入价', key: 'buyPrice', width: '90px', align: 'end' as const },
  { title: '卖出价', key: 'sellPrice', width: '90px', align: 'end' as const },
  { title: '手续费', key: 'fee', width: '80px', align: 'end' as const },
  { title: '买入时间', key: 'buyDate', width: '120px' },
  { title: '卖出时间', key: 'sellDate', width: '120px' },
  { title: '当前价', key: 'currentPrice', width: '90px', align: 'end' as const },
  { title: '盈亏', key: 'profit', width: '100px', align: 'end' as const },
  { title: '盈亏率', key: 'profitRate', width: '90px', align: 'end' as const },
  { title: '操作', key: 'actions', width: '100px', align: 'end' as const, sortable: false },
]

// 筛选选项
const typeOptions = [
  { title: '股票', value: 'stock' },
  { title: '基金', value: 'fund' },
]

const statusOptions = [
  { title: '已卖出', value: 'sold' },
  { title: '持有中', value: 'holding' },
]

// 搜索和筛选
const searchValue = ref('')
const typeFilter = ref<string | null>(null)
const statusFilter = ref<string | null>(null)

// 对话框状态
const dialog = ref(false)
const isEditing = ref(false)
const deleteDialog = ref(false)
const deleteItem = ref<TradeRecord | null>(null)
const formRef = ref()
const formValid = ref(false)

// 表单数据
const formData = reactive<Partial<TradeRecord>>({
  type: 'stock',
  code: '',
  name: '',
  amount: 0,
  buyPrice: 0,
  sellPrice: undefined,
  fee: 0,
  buyDate: '',
  sellDate: undefined,
  currentPrice: undefined,
})

// 示例数据
const dataItems = ref<TradeRecord[]>([
  {
    id: '1',
    type: 'stock',
    code: '600519',
    name: '贵州茅台',
    amount: 100,
    buyPrice: 1850.00,
    sellPrice: 1920.00,
    fee: 15.00,
    buyDate: '2024-01-15',
    sellDate: '2024-03-20',
    currentPrice: undefined,
    profit: 6845.00,
    profitRate: 3.70,
  },
  {
    id: '2',
    type: 'stock',
    code: '000858',
    name: '五粮液',
    amount: 200,
    buyPrice: 165.50,
    sellPrice: undefined,
    fee: 12.00,
    buyDate: '2024-02-01',
    sellDate: undefined,
    currentPrice: 172.30,
  },
  {
    id: '3',
    type: 'fund',
    code: '510300',
    name: '沪深300ETF',
    amount: 1000,
    buyPrice: 3.85,
    sellPrice: 4.12,
    fee: 5.00,
    buyDate: '2024-01-10',
    sellDate: '2024-04-15',
    currentPrice: undefined,
    profit: 260.00,
    profitRate: 6.75,
  },
])

const loading = ref(false)

// 过滤后的数据
const filteredItems = computed(() => {
  let result = [...dataItems.value]

  // 计算盈亏
  result = result.map(item => calculateProfit(item))

  // 搜索过滤
  if (searchValue.value) {
    const keyword = searchValue.value.toLowerCase()
    result = result.filter(item =>
      item.code.toLowerCase().includes(keyword) ||
      item.name.toLowerCase().includes(keyword)
    )
  }

  // 类型筛选
  if (typeFilter.value) {
    result = result.filter(item => item.type === typeFilter.value)
  }

  // 状态筛选
  if (statusFilter.value) {
    if (statusFilter.value === 'sold') {
      result = result.filter(item => item.sellPrice !== undefined)
    } else {
      result = result.filter(item => item.sellPrice === undefined)
    }
  }

  return result
})

// 计算盈亏
function calculateProfit(item: TradeRecord): TradeRecord {
  const buyCost = item.amount * item.buyPrice
  const buyFee = item.fee

  if (item.sellPrice !== undefined) {
    // 已卖出
    const sellRevenue = item.amount * item.sellPrice
    const sellFee = item.fee * (item.sellPrice / item.buyPrice)
    item.profit = sellRevenue - buyCost - buyFee - sellFee
    item.profitRate = (item.profit / (buyCost + buyFee)) * 100
  } else if (item.currentPrice !== undefined) {
    // 持有中，计算浮动盈亏
    const currentValue = item.amount * item.currentPrice
    item.profit = currentValue - buyCost - buyFee
    item.profitRate = (item.profit / (buyCost + buyFee)) * 100
  } else {
    item.profit = undefined
    item.profitRate = undefined
  }

  return item
}

// 统计
const totalProfit = computed(() => {
  return filteredItems.value.reduce((sum, item) => sum + (item.profit || 0), 0)
})

const totalAmount = computed(() => {
  return filteredItems.value.reduce((sum, item) => sum + item.amount * item.buyPrice, 0)
})

const profitCount = computed(() => {
  return filteredItems.value.filter(item => (item.profit || 0) > 0).length
})

const lossCount = computed(() => {
  return filteredItems.value.filter(item => (item.profit || 0) < 0).length
})

// 格式化
function formatNumber(num: number): string {
  return num.toFixed(2)
}

function getProfitClass(item: TradeRecord): string {
  if ((item.profit || 0) > 0) return 'text-success font-weight-bold'
  if ((item.profit || 0) < 0) return 'text-error font-weight-bold'
  return 'text-grey'
}

function getProfitRateColor(rate: number): string {
  if (rate > 0) return 'success'
  if (rate < 0) return 'error'
  return 'grey'
}

// 打开对话框
function openDialog(item?: TradeRecord) {
  if (item) {
    isEditing.value = true
    Object.assign(formData, item)
  } else {
    isEditing.value = false
    resetForm()
  }
  dialog.value = true
}

function resetForm() {
  formData.type = 'stock'
  formData.code = ''
  formData.name = ''
  formData.amount = 0
  formData.buyPrice = 0
  formData.sellPrice = undefined
  formData.fee = 0
  formData.buyDate = new Date().toISOString().split('T')[0]
  formData.sellDate = undefined
  formData.currentPrice = undefined
}

// 保存
function handleSave() {
  if (!formRef.value.validate()) return

  if (isEditing.value) {
    const index = dataItems.value.findIndex(item => item.id === formData.id)
    if (index > -1) {
      dataItems.value[index] = { ...dataItems.value[index], ...formData } as TradeRecord
    }
    showSnackbar('记录已更新', 'success')
  } else {
    const newItem: TradeRecord = {
      ...formData,
      id: Date.now().toString(),
    } as TradeRecord
    dataItems.value.unshift(newItem)
    showSnackbar('记录已添加', 'success')
  }
  dialog.value = false
}

// 删除
function handleDelete(item: TradeRecord) {
  deleteItem.value = item
  deleteDialog.value = true
}

function confirmDelete() {
  if (deleteItem.value) {
    const index = dataItems.value.findIndex(item => item.id === deleteItem.value!.id)
    if (index > -1) {
      dataItems.value.splice(index, 1)
    }
    showSnackbar('记录已删除', 'error')
  }
  deleteDialog.value = false
  deleteItem.value = null
}

// 提示
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
})

function showSnackbar(text: string, color: string = 'success') {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}
</script>

<style scoped>
.note-page {
  padding: 16px;
}

.table-header {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  padding: 16px 20px;
  border-radius: 12px 12px 0 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.header-actions .v-btn {
  color: #8b5cf6;
}

.header-actions .v-btn:hover {
  background: rgba(255, 255, 255, 0.9) !important;
}

.search-field :deep(.v-field) {
  border-radius: 0;
  background: white;
}

.filter-select :deep(.v-field) {
  border-radius: 0;
  background: white;
}

.note-container {
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: white;
}

.note-table :deep(.v-data-table__thead) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.note-table :deep(.v-data-table__thead th) {
  font-weight: 600 !important;
  color: rgba(0, 0, 0, 0.7) !important;
  font-size: 0.875rem;
}

.note-table :deep(.v-data-table__tr) {
  transition: all 0.2s ease;
}

.note-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(139, 92, 246, 0.06) !important;
  transform: translateX(2px);
}

/* 统计卡片 */
.stats-card {
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stats-card-1 {
  border-left: 4px solid #8b5cf6 !important;
}

.stats-card-2 {
  border-left: 4px solid #3b82f6 !important;
}

.stats-card-3 {
  border-left: 4px solid #22c55e !important;
}

.stats-card-4 {
  border-left: 4px solid #ef4444 !important;
}

/* 对话框 */
.note-dialog {
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
}

.dialog-header-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}
</style>
