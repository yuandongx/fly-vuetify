<template>
  <div class="fund-table-container">
    <FundSearchBar :on-refresh="handleRefresh" :on-search="handleSearch" />
    <v-divider class="header-divider" />

    <v-data-table-server
      class="fund-table elevation-0"
      :headers="headers"
      :items="items"
      :items-length="serverItemsLength"
      :loading="loading"
      @update:options="handleOptionsChange"
    >
      <!-- 加载状态 -->
      <template #loading>
        <v-skeleton-loader type="table-row@6" />
      </template>

      <!-- 空状态 -->
      <template #no-data>
        <div class="d-flex flex-column align-center justify-center pa-8">
          <v-icon class="mb-4" color="grey-lighten-1" icon="mdi-piggybank-off-outline" size="64" />
          <div class="text-h6 text-grey">暂无基金数据</div>
          <div class="text-body-2 text-grey-lighten-1 mt-2">请尝试调整搜索条件</div>
        </div>
      </template>

      <!-- 表格内容 -->
      <template #item="{ item }">
        <FundRow
          :favorite="() => favorite(item)"
          :headers="props.dataHeaders"
          :item="item"
          :on-handle-more="() => handleMore(item)"
        >
          <template #snack-bar>
            <v-snackbar
              v-model="showSnackBar"
              color="surface-variant"
              location="bottom right"
              :timeout="2000"
            >
              <v-icon class="mr-2" :icon="snackbarIcon" />
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
            density="compact"
            :length="Math.ceil(serverItemsLength / itemsPerPage)"
            rounded="circle"
            :total-visible="5"
            @update:model-value="onPageChange"
          />
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
  import type { TableColumn, TableRow } from '@/types/table'
  import { fundApi } from '@/http/api'
  import { get } from '@/http/common'
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

  type Order = { key: string, order: string }
  type options = { page: number, itemsPerPage: number, sortBy: Order[], groupBy: string, search: string }

  const props = defineProps({
    dataSourcePath: {
      type: String,
      default: '/api/fund',
    },
    dataHeaders: {
      type: Array as PropType<TableColumn[]>,
      default: () => fundAllHeader,
    },
  })

  const headers = [
    ...props.dataHeaders,
    { id: 17, key: 'operation', title: '操作', sortable: false, align: 'end' as const },
  ]

  let queryOptions: options = {
    search: '',
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    groupBy: '',
  }

  function handleOptionsChange ({ page, itemsPerPage: limit, sortBy, groupBy, search: searchVal }: options) {
    currentPage.value = page
    itemsPerPage.value = limit || 10
    loadItems({ page, itemsPerPage: limit, sortBy, groupBy, search: searchVal })
  }

  /** 后端返回中文key -> 前端英文key 映射表 */
  const FIELD_MAP: Record<string, string> = {
    '基金代码': 'code',
    '标准优惠费率': 'biao_zhun_you_hui_fei_lv',
    '基金简称': 'name',
    '基金类型': 'fund_type',
    '更新时间': 'update_time',
    '成立日期': 'established_time',
    '最新规模': 'latest_scale',
    '基金公司': 'fund_company',
    '数据日期': 'date',
    '日增长率(%)': 'day_growth_rate',
    '近1周收益(%)': 'week_growth_rate',
    '近1月收益(%)': 'month_growth_rate',
    '近3月收益(%)': 'quarter_growth_rate',
    '近6月收益(%)': 'half_year_growth_rate',
    '近1年收益(%)': 'year_growth_rate',
    '近2年收益(%)': 'two_year_growth_rate',
    '近3年收益(%)': 'three_year_growth_rate',
    '今年以来收益(%)': 'this_year_growth_rate',
    '成立以来年化收益(%)': 'total_growth_rate',
    '手续费': 'fee',
    '跟踪指数': 'track_index',
    '单位净值': 'unit_net_value',
    '累计净值': 'total_net_value',
    '基金规模(万元)': 'latest_scale',
    '综合评分': 'score',
    '同类排名': 'rank',
    '是否关注': 'follow',
  }

  function mapFields (row: Record<string, unknown>): TableRow {
    const mapped: TableRow = { ...row as TableRow }
    for (const [cnKey, enKey] of Object.entries(FIELD_MAP)) {
      if (row[cnKey] !== undefined) {
        mapped[enKey] = row[cnKey] as string | number
      }
    }
    // 保留原始字段，确保同时存在中文和英文 key
    return mapped
  }

  function loadItems (options?: options, loadingShow?: boolean) {
    loading.value = loadingShow !== undefined && loadingShow ? true : false
    queryOptions = {
      ...queryOptions,
      ...options,
    }
    const queryParams = {
      query: options?.search ? options.search : queryOptions.search || '',
      page: options?.page ? String(options.page) : String(queryOptions.page) || '1',
      page_size: options?.itemsPerPage ? String(options.itemsPerPage) : String(queryOptions.itemsPerPage) || '10',
      order_by: options?.sortBy?.[0]?.key ?? queryOptions.sortBy?.[0]?.key ?? '',
      sort: options?.sortBy?.[0]?.order ?? queryOptions.sortBy?.[0]?.order ?? '',
    }
    get(props.dataSourcePath, queryParams)
      .then(res => {
        loading.value = false
        serverItemsLength.value = res.total || 0
        const rawData = res.items || []
        items.value = rawData.map((row: Record<string, unknown>) => mapFields(row))
      })
      .catch(() => {
        loading.value = false
      })
  }


  function handleMore (item: TableRow) {
    showDialog.value = true
  }

  function handleSearch (search: string) {
    queryOptions.search = search
    queryOptions.page = 1
    currentPage.value = 1
    loadItems({ ...queryOptions, page: 1 })
  }

  function handleRefresh () {
    loadItems(queryOptions)
  }

  function favorite (item: TableRow) {
    const flag = item.follow === 1 || item.follow === '1' ? 0 : 1
    get(fundApi.favorite(item.code, flag))
      .then(() => {
        snackbarIcon.value = flag === 0 ? 'mdi-heart-broken' : 'mdi-heart'
        tip_message.value = flag === 0 ? '已取消关注' : '已关注该基金'
        showSnackBar.value = true
        loadItems(queryOptions)
      })
  }

  function onPageChange (page: number) {
    loadItems({ ...queryOptions, page })
  }

  let interval: number | undefined = undefined

  onMounted(() => {
    loadItems(undefined, true)
    interval = setInterval(() => {
      loadItems(queryOptions)
    }, 10_000)
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
