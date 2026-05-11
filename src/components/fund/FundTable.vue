<template>
  <div class="fund-table-container">
    <FundSearchBar :on-search="handleSearch" :on-refresh="handleRefresh" />
    <v-divider class="header-divider"></v-divider>

    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="serverItemsLength"
      :loading="loading"
      class="fund-table elevation-0"
      @update:options="handleOptionsChange"
    >
      <!-- 加载状态 -->
      <template #loading>
        <v-skeleton-loader type="table-row@6"></v-skeleton-loader>
      </template>

      <!-- 空状态 -->
      <template #no-data>
        <div class="d-flex flex-column align-center justify-center pa-8">
          <v-icon icon="mdi-piggybank-off-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
          <div class="text-h6 text-grey">暂无基金数据</div>
          <div class="text-body-2 text-grey-lighten-1 mt-2">请尝试调整搜索条件</div>
        </div>
      </template>

      <!-- 表格内容 -->
      <template #item="{ item }">
        <FundRow
          :favorite="() => favorite(item)"
          :item="item"
          :headers="props.dataHeaders"
          :on-handle-more="() => handleMore(item)"
        >
          <template #snack-bar>
            <v-snackbar
              v-model="showSnackBar"
              :timeout="2000"
              location="bottom right"
              color="surface-variant"
            >
              <v-icon :icon="snackbarIcon" class="mr-2"></v-icon>
              {{ tip_message }}
              <template #actions>
                <v-btn variant="text" @click="showSnackBar = false">关闭</v-btn>
              </template>
            </v-snackbar>
          </template>
        </FundRow>
      </template>

      <!-- 分页 -->
      <template #bottom>
        <div class="d-flex align-center justify-space-between pa-4 border-t">
          <div class="text-body-2 text-grey">
            共 {{ serverItemsLength }} 只基金
          </div>
          <v-pagination
            v-model="currentPage"
            :length="Math.ceil(serverItemsLength / itemsPerPage)"
            :total-visible="5"
            density="compact"
            rounded="circle"
            @update:model-value="onPageChange"
          ></v-pagination>
        </div>
      </template>
    </v-data-table-server>

    <!-- 详情弹窗 -->
    <MoreInfo v-model="showDialog">
      <template #monitor-info>
        <TaskForm />
      </template>
    </MoreInfo>
  </div>
</template>

<script setup lang="ts">
import { get } from '@/http/common'
import { fundApi } from '@/http/api'
import { type TableColumn, type TableRow } from '@/types/table'
import { fundAllHeader } from '@/vars/fund'

const items = ref<TableRow[]>([])
const serverItemsLength = ref(0)
const showDialog = ref(false)
const showSnackBar = ref(false)
const tip_message = ref('')
const snackbarIcon = ref('mdi-check-circle')
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)

type Order = { key: string; order: string }
type options = { page: number; itemsPerPage: number; sortBy: Order[]; groupBy: string; search: string }

const props = defineProps({
  dataSourcePath: {
    type: String,
    default: '/api/fund/all'
  },
  dataHeaders: {
    type: Array as PropType<TableColumn[]>,
    default: () => fundAllHeader
  }
})

const headers = [
  ...props.dataHeaders,
  { id: 17, key: 'operation', title: '操作', sortable: false, align: 'end' as const }
]

let queryOptions: options = {
  search: '',
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: ''
}

const handleOptionsChange = ({ page, itemsPerPage: limit, sortBy, groupBy, search: searchVal }: options) => {
  currentPage.value = page
  itemsPerPage.value = limit || 10
  loadItems({ page, itemsPerPage: limit, sortBy, groupBy, search: searchVal })
}

const loadItems = (options?: options, loadingShow?: boolean) => {
  loading.value = loadingShow !== undefined && loadingShow ? true : false
  queryOptions = {
    ...queryOptions,
    ...options
  }
  const queryParams = {
    query: options?.search ? options.search : queryOptions.search || '',
    page: options?.page ? String(options.page) : String(queryOptions.page) || '1',
    page_size: options?.itemsPerPage ? String(options.itemsPerPage) : String(queryOptions.itemsPerPage) || '10',
    order_by: options?.sortBy?.[0]?.key ?? queryOptions.sortBy?.[0]?.key ?? '',
    sort: options?.sortBy?.[0]?.order ?? queryOptions.sortBy?.[0]?.order ?? ''
  }
  get(props.dataSourcePath, queryParams)
    .then((res) => {
      loading.value = false
      serverItemsLength.value = res.total
      items.value = res.data || []
    })
    .catch(() => {
      loading.value = false
    })
}

const handleMore = (item: TableRow) => {
  showDialog.value = true
}

const handleSearch = (search: string) => {
  queryOptions.search = search
  queryOptions.page = 1
  currentPage.value = 1
  loadItems({ ...queryOptions, page: 1 })
}

const handleRefresh = () => {
  loadItems(queryOptions)
}

const favorite = (item: TableRow) => {
  const flag = item.follow === 1 || item.follow === '1' ? 0 : 1
  get(fundApi.favorite(item.code, flag))
    .then(() => {
      snackbarIcon.value = flag === 0 ? 'mdi-heart-broken' : 'mdi-heart'
      tip_message.value = flag === 0 ? '已取消关注' : '已关注该基金'
      showSnackBar.value = true
      loadItems(queryOptions)
    })
}

const onPageChange = (page: number) => {
  loadItems({ ...queryOptions, page })
}

let interval: number | undefined = undefined

onMounted(() => {
  loadItems(undefined, true)
  interval = setInterval(() => {
    loadItems(queryOptions)
  }, 10000)
})

onUnmounted(() => {
  if (interval !== undefined) {
    clearInterval(interval)
  }
})
</script>

<style scoped>
.fund-table-container {
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-divider {
  border-color: rgba(0, 0, 0, 0.06);
}

.fund-table :deep(.v-data-table__thead) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.fund-table :deep(.v-data-table__thead th) {
  font-weight: 600 !important;
  color: rgba(0, 0, 0, 0.7) !important;
  font-size: 0.875rem;
  white-space: nowrap;
}

.fund-table :deep(.v-data-table__tr) {
  transition: all 0.2s ease;
}

.fund-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(17, 153, 142, 0.04) !important;
}

.fund-table :deep(.v-data-table__td) {
  font-size: 0.875rem;
  vertical-align: middle;
}
</style>
