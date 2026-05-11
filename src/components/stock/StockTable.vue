<template>
  <div class="stock-table-container">
    <StockTableHeader :on-search="handleSearch" :on-select-areas="handleSelectAreas" />
    <v-divider class="header-divider"></v-divider>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="tableHeaders"
      :items="rows"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="name"
      class="stock-table elevation-0"
      @update:options="loadItems"
    >
      <!-- 加载状态 -->
      <template #loading>
        <v-skeleton-loader type="table-row@6"></v-skeleton-loader>
      </template>

      <!-- 空状态 -->
      <template #no-data>
        <div class="d-flex flex-column align-center justify-center pa-8">
          <v-icon icon="mdi-database-off-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
          <div class="text-h6 text-grey">暂无数据</div>
          <div class="text-body-2 text-grey-lighten-1 mt-2">请尝试调整筛选条件</div>
        </div>
      </template>

      <!-- 表格内容 -->
      <template #item="{ item }">
        <stock-row
          :item="item"
          :headers="stockColumns"
          :favorite="() => handleFavorite(item)"
          :on-handle-more="handleMore"
        >
          <template #snack-bar>
            <v-snackbar
              v-model="showSnackbar"
              :timeout="2000"
              location="bottom right"
              color="surface-variant"
            >
              <v-icon :icon="snackbarIcon" class="mr-2"></v-icon>
              {{ tips_favorite }}
              <template #actions>
                <v-btn variant="text" @click="showSnackbar = false">关闭</v-btn>
              </template>
            </v-snackbar>
          </template>
        </stock-row>
      </template>

      <!-- 分页 -->
      <template #bottom>
        <div class="d-flex align-center justify-space-between pa-4 border-t">
          <div class="text-body-2 text-grey">
            共 {{ totalItems }} 条记录
          </div>
          <v-pagination
            v-model="currentPage"
            :length="Math.ceil(totalItems / itemsPerPage)"
            :total-visible="5"
            density="compact"
            rounded="circle"
            @update:model-value="onPageChange"
          ></v-pagination>
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import type { StockRow } from '@/types/stock'
import { stockColumns } from '@/vars/stock'
import { get } from '@/http/common'
import { stockApi } from '@/http/api'

const loading = ref(true)
const showSnackbar = ref(false)
const tips_favorite = ref('')
const snackbarIcon = ref('mdi-check-circle')
const itemsPerPage = ref(10)
const currentPage = ref(1)
const search = ref('')
const totalItems = ref(0)
const rows = ref<StockRow[]>([])

const tableHeaders = [
  ...stockColumns,
  { key: 'operation', title: '操作', sortable: false, align: 'end' as const }
]

const params = ref({
  page: '1',
  page_size: '10',
  order_by: '',
  order: '',
  search: '',
  area: 'sh,sz,bj'
})

const props = defineProps({
  dataSourcePath: {
    type: String,
    default: stockApi.list
  }
})

const handleSearch = (val: string) => {
  params.value.search = val
  params.value.page = '1'
  currentPage.value = 1
  loadItems({ ...params.value, page: 1 })
}

const handleSelectAreas = (val: string) => {
  params.value.area = val
  params.value.page = '1'
  currentPage.value = 1
  loadItems(params.value)
}

const loadItems = async ({ page, itemsPerPage: limit, sortBy, search: searchVal }: any) => {
  params.value = {
    ...params.value,
    page: String(page),
    page_size: String(limit || 10),
    order_by: sortBy?.[0]?.key ?? '',
    order: sortBy?.[0]?.order ?? '',
    search: searchVal || ''
  }
  loading.value = true
  try {
    const res = await get(props.dataSourcePath, params.value)
    rows.value = res.data || []
    totalItems.value = res.total || 0
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

const handleFavorite = (item: StockRow) => {
  const flag = item.follow === 1 || item.follow === '1' ? 0 : 1
  get(stockApi.follow(item.code, flag))
    .then(() => {
      loadItems(params.value)
      tips_favorite.value = flag === 0 ? '已取消关注' : '已关注该股票'
      snackbarIcon.value = flag === 0 ? 'mdi-heart-broken' : 'mdi-heart'
      showSnackbar.value = true
    })
    .catch(error => {
      console.error('关注操作失败:', error)
    })
}

const handleMore = (item: StockRow) => {
  console.log('查看更多:', item)
  // 可以打开详情弹窗等
}

const onPageChange = (page: number) => {
  loadItems({ ...params.value, page })
}

onMounted(() => {
  loadItems({ page: 1, itemsPerPage: 10 })
})

onBeforeUnmount(() => {
  rows.value = []
})
</script>

<style scoped>
.stock-table-container {
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-divider {
  border-color: rgba(0, 0, 0, 0.06);
}

.stock-table :deep(.v-data-table__thead) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.stock-table :deep(.v-data-table__thead th) {
  font-weight: 600 !important;
  color: rgba(0, 0, 0, 0.7) !important;
  font-size: 0.875rem;
  white-space: nowrap;
}

.stock-table :deep(.v-data-table__tr) {
  transition: all 0.2s ease;
}

.stock-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(102, 126, 234, 0.04) !important;
}

.stock-table :deep(.v-data-table__td) {
  font-size: 0.875rem;
}
</style>
