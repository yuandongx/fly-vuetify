<template>
    <v-data-table-server
     v-model:items-per-page="itemsPerPage"
    :headers="STOCK_COLUMNS"
    :items="rows"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    item-value="name"
    @update:options="loadItems"
     >

    </v-data-table-server>
</template>
<script setup lang="ts">

import type { StockResponse, StockRow } from '@/types/stock';
import { STOCK_COLUMNS } from '@/vars/stock';
import { getStockList } from '@/http/stock';
const loading = ref(true)
const page = ref(1);
const itemsPerPage = ref(10);
const search = ref('');
const totalItems = ref(0);
const rows = ref<StockRow[]>([]);

const loadItems = async ({ page, itemsPerPage, sortBy }: any) => {
    console.log('--sortBy----->', sortBy);
    loading.value = true;
    const res: StockResponse = await getStockList({
        page: String(page),
        page_size: String(itemsPerPage),
        order_by: sortBy !== undefined && sortBy?.[0]?.key !== undefined ? sortBy?.[0]?.key : "",
        order: sortBy !== undefined && sortBy?.[0]?.order !== undefined ? sortBy?.[0]?.order : ""
    });
    rows.value = res.data;
    totalItems.value = res.total;
    loading.value = false;
}

onMounted(() => {
    loadItems({ page: 1, itemsPerPage: 10 });
})
onBeforeUnmount(() => {
    rows.value = [];
})
</script>
