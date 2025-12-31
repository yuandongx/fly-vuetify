<template>
    <v-data-table
     :loading="loading"
     striped="even" 
     class="elevation-1"
     v-model:page="page"
     v-model:items-per-page="itemsPerPage"
     >
        <table-head :headers="STOCK_COLUMNS" />
        <table-body :rows="rows" :headers="STOCK_COLUMNS" />
    </v-data-table>
</template>
<script setup lang="ts">
    
import TableHead from './TableHead.vue';
import TableBody from './TableBody.vue';

    import type { StockResponse, StockRow } from '@/types/stock';
    import { STOCK_COLUMNS } from '@/vars/stock';
    import { getStockList } from '@/http/stock';
    const loading = ref(true)
    const page = ref(1);
    const itemsPerPage = ref(10);
    const rows = ref<StockRow[]>([]);
    const get = async () => {
        const res: StockResponse = await getStockList();
        rows.value = res.data;
    }
    onMounted(() => {
        get();
    })
    onBeforeUnmount(() => {
        rows.value = [];
    })
</script>
