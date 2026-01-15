<template>
    <v-data-table-server
        :headers="headers"
        :items="items"
        :items-length="serverItemsLength"
        :loading="loading"
        @update:options="handleOptionsChange"
    >
    <template #item="{ item }">
        <FundRow :item="item" :headers="fundAllHeader" />
    </template>
</v-data-table-server>
</template>
<script setup lang="ts">
import { get } from '@/http/common'
import { type TableColumn, type TableRow } from '@/types/table'
import { fundAllHeader } from '@/vars/fund'
const items = ref<TableRow[]>([])
const serverItemsLength = ref(0)
const loading = ref(false)
type Order = {key: string, order: string}
const headers = [...fundAllHeader, {id: 17, key: 'operation', title: '操作'}]
type options = {page: number, itemsPerPage: number, sortBy: Order[], groupBy: string, search: string}

const handleOptionsChange = ({page, itemsPerPage, sortBy, groupBy, search}: options) => {
    console.log(page, itemsPerPage, sortBy, groupBy, search)
    loadIems({page, itemsPerPage, sortBy, groupBy, search})
}
const loadIems = ( options?: options) => {
    console.log('loadIems')
    loading.value = true
    get('/api/fund/all', {
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
onMounted(() => {
    loadIems()
})
</script>