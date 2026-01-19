<template>
    <FundSearchBar />
    <v-divider />
    <v-data-table-server
        :headers="headers"
        :items="items"
        :items-length="serverItemsLength"
        :loading="loading"
        @update:options="handleOptionsChange"
    >
    <template #item="{ item }">
        <FundRow :item="item" :headers="headers" :onHandleMore="handleMore" />
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
const loadIems = ( options?: options, loadingShow?: boolean) => {
    loading.value = loadingShow !== undefined && loadingShow ? true : false
    get(props.dataSourcePath, {
        query: options?.search || "",
        page: String(options?.page || 1),
        page_size: String(options?.itemsPerPage || 10),
        order_by: options?.sortBy !== undefined && options.sortBy?.[0]?.key !== undefined ? options.sortBy?.[0]?.key : "",
        sort: options?.sortBy !== undefined && options.sortBy?.[0]?.order !== undefined ? options.sortBy?.[0]?.order : ""
    }).then((res) => {
        console.log(res)
        loading.value = false
        serverItemsLength.value = res.total
        items.value = res.data
    })
}
const handleMore = (item: TableRow) => {
    showDialog.value = true
}
let interval: number|undefined = undefined
onMounted(() => {
    loadIems(undefined, true)
    interval = setInterval(() => {
        loadIems()
    }, 10000)
})
onUnmounted(() => {
    if (interval !== undefined) {
        clearInterval(interval)
    }
})
</script>