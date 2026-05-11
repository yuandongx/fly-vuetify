<template>
  <div class="stock-table-container">
    <StockTableHeader :on-search="handleSearch" :on-select-areas="handleSelectAreas" />
    <v-divider class="header-divider" />

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      class="stock-table elevation-0"
      :headers="tableHeaders"
      item-value="name"
      :items="rows"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      @update:options="loadItems"
    >
      <!-- 加载状态 -->
      <template #loading>
        <v-skeleton-loader type="table-row@6" />
      </template>

      <!-- 空状态 -->
      <template #no-data>
        <div class="d-flex flex-column align-center justify-center pa-8">
          <v-icon class="mb-4" color="grey-lighten-1" icon="mdi-database-off-outline" size="64" />
          <div class="text-h6 text-grey">暂无数据</div>
          <div class="text-body-2 text-grey-lighten-1 mt-2">请尝试调整筛选条件</div>
        </div>
      </template>

      <!-- 表格内容 -->
      <template #item="{ item }">
        <stock-row
          :favorite="() => handleFavorite(item)"
          :headers="stockColumns"
          :item="item"
          :on-handle-more="handleMore"
        >
          <template #snack-bar>
            <v-snackbar
              v-model="showSnackbar"
              color="surface-variant"
              location="bottom right"
              :timeout="2000"
            >
              <v-icon class="mr-2" :icon="snackbarIcon" />
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
            density="compact"
            :length="Math.ceil(totalItems / itemsPerPage)"
            rounded="circle"
            :total-visible="5"
            @update:model-value="onPageChange"
          />
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
  import type { StockRow } from '@/types/stock'
  import { stockApi } from '@/http/api'
  import { get } from '@/http/common'
  import { stockColumns } from '@/vars/stock'

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
    { key: 'operation', title: '操作', sortable: false, align: 'end' as const },
  ]

  const params = ref({
    page: '1',
    page_size: '10',
    order_by: '',
    order: '',
    search: '',
    area: 'sh,sz,bj',
  })

  const props = defineProps({
    dataSourcePath: {
      type: String,
      default: stockApi.list,
    },
  })

  function handleSearch (val: string) {
    params.value.search = val
    params.value.page = '1'
    currentPage.value = 1
    loadItems({ ...params.value, page: 1 })
  }

  function handleSelectAreas (val: string) {
    params.value.area = val
    params.value.page = '1'
    currentPage.value = 1
    loadItems(params.value)
  }

  async function loadItems ({ page, itemsPerPage: limit, sortBy, search: searchVal }: any) {
    params.value = {
      ...params.value,
      page: String(page),
      page_size: String(limit || 10),
      order_by: sortBy?.[0]?.key ?? '',
      order: sortBy?.[0]?.order ?? '',
      search: searchVal || '',
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

  function handleFavorite (item: StockRow) {
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

  function handleMore (item: StockRow) {
    console.log('查看更多:', item)
  // 可以打开详情弹窗等
  }

  function onPageChange (page: number) {
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
