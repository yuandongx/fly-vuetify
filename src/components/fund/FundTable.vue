<template>
    <FundSearchBar :search="handleSearch"/>
    <v-divider />
    <v-data-table-server
        :headers="headers"
        :items="items"
        :items-length="serverItemsLength"
        :loading="loading"
        @update:options="handleOptionsChange"
    >
    <template #item="{ item }">
        <FundRow
        :favorite="()=>favorite(item)"
        :item="item"
        :headers="headers"
        :onHandleMore="()=>handleMore(item)">
        <template #snack-bar>
            <v-snackbar v-model="showSnackBar" timeout="3000" location="right center">
                {{ tip_message }}
                <template v-slot:actions>
                    <v-btn text @click="showSnackBar = false">确定</v-btn>
                </template>
            </v-snackbar>
        </template>
        </FundRow>
    </template>
</v-data-table-server>
<FundDetail v-model="showDialog" />
</template>
<script setup lang="ts">
import { get } from '@/http/common'
import { type TableColumn, type TableRow } from '@/types/table'
import { fundAllHeader } from '@/vars/fund'
const items = ref<TableRow[]>([])
const serverItemsLength = ref(0)
const showDialog = ref(false)
const showSnackBar = ref(false)
const tip_message = ref('')
const loading = ref(false)
type Order = {key: string, order: string}
type options = {page: number, itemsPerPage: number, sortBy: Order[], groupBy: string, search: string}
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
const headers = [...props.dataHeaders, {id: 17, key: 'operation', title: '操作'}]
const handleOptionsChange = ({page, itemsPerPage, sortBy, groupBy, search}: options) => {
    console.log(page, itemsPerPage, sortBy, groupBy, search)
    loadIems({page, itemsPerPage, sortBy, groupBy, search})
}
let queryOptions: options = {
    search: '',
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    groupBy: '',
} 
const loadIems = ( options?: options, loadingShow?: boolean) => {
    loading.value = loadingShow !== undefined && loadingShow ? true : false
    queryOptions = {
        ...queryOptions,
        ...options
    }
    const queryParams = {
        query: options?.search ? options.search : queryOptions.search||'',
        page: options?.page? String(options.page) : String(queryOptions.page)||'1',
        page_size: options?.itemsPerPage? String(options.itemsPerPage) : String(queryOptions.itemsPerPage)||'10',
        order_by: options?.sortBy?.[0]?.key ?? queryOptions.sortBy?.[0]?.key ?? '',
        sort: options?.sortBy?.[0]?.order ?? queryOptions.sortBy?.[0]?.order ?? '',
    }
    get(props.dataSourcePath, queryParams).then((res) => {
        console.log(res)
        loading.value = false
        serverItemsLength.value = res.total
        items.value = res.data
    })
}
const handleMore = (item: TableRow) => {
    showDialog.value = true
}
const handleSearch = (search: string) => {
    loadIems({...queryOptions, search, page: 1})
}
const favorite = (item: TableRow) => {
    const flag = item.follow == 1 ||item.follow == '1' ? 0 : 1
        get(`/api/fund/favorite/${item.code}/${flag}`).then(() => {
            console.log(`favorited ${item.id}`)
            showSnackBar.value = true
            tip_message.value = flag == 0 ? '已取消关注' : '已关注该基金'
            loadIems(queryOptions)
        })
   
}
let interval: number|undefined = undefined
onMounted(() => {
    loadIems(undefined, true)
    interval = setInterval(() => {
        loadIems(queryOptions)
    }, 10000)
})
onUnmounted(() => {
    if (interval !== undefined) {
        clearInterval(interval)
    }
})
</script>