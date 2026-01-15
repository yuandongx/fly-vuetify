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
let page = 1
let itemsPerPage = 10
type Order = {key: string, order: string}
let sortBy: Order[] = []
const headers = [...fundAllHeader, {id: 17, key: 'operation', title: '操作'}]
type options = {page: number, itemsPerPage: number, sortBy: string, groupBy: string, search: string}
const handleOptionsChange = ({page, itemsPerPage, sortBy, groupBy, search}: options) => {
    console.log(page, itemsPerPage, sortBy, groupBy, search)
}
const loadIems = () => {
    console.log('loadIems')
    loading.value = true
    get('/api/fund/all', {
        page: String(page),
        page_size: String(itemsPerPage),
        order_by: sortBy !== undefined && sortBy?.[0]?.key !== undefined ? sortBy?.[0]?.key : "",
        order: sortBy !== undefined && sortBy?.[0]?.order !== undefined ? sortBy?.[0]?.order : ""
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