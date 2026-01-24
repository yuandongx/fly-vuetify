<template>

    <stock-table-header :search="handleSearch" :select-areas="selectAreas"/>
    <v-divider color="green-lighten-4"> </v-divider>
    <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="tableHeaders" :items="rows"
        :items-length="totalItems" :loading="loading" :search="search" item-value="name" @update:options="loadItems">
    <template #item="{ item }">
        <stock-row :item="item" :headers="stockColumns" :favorite="() => handleFavorite(item)" >
            <template #snack-bar>
                <v-snackbar v-model="showSnackbar" timeout="3000" location="right center">
                    {{ tips_favorite }}
                    <template v-slot:actions>
                        <v-btn text @click="showSnackbar = false">确定</v-btn>
                    </template>
                </v-snackbar>
            </template>
        </stock-row>
    </template>
    </v-data-table-server>
</template>
<script setup lang="ts">

import type { StockResponse, StockRow } from '@/types/stock';
import { stockColumns } from '@/vars/stock';
import { getStockList } from '@/http/stock';
import { get } from '@/http/common';
const loading = ref(true)
const showSnackbar = ref(false);
const itemsPerPage = ref(10);
const search = ref('');
const totalItems = ref(0);
const rows = ref<StockRow[]>([]);
const tips_favorite = ref('');
const tableHeaders = [...stockColumns, { id: 9999, key: 'operation', title: '操作' }];
let params = {
    page: '1',
    page_size: '10',
    order_by: '',
    order: '',
    search: '',
    area: 'sh,sz,bj'
};

const handleSearch = (val: string) => {
    loadItems({ ...params, search: val });
}
const selectAreas = (val: string) => {
    params.area = val;
    loadItems(params);
}
const loadItems = async ({ page, itemsPerPage, sortBy, search }: any) => {
    params = {
        ...params,
        page: String(page),
        page_size: String(itemsPerPage? itemsPerPage : 10),
        order_by: sortBy !== undefined && sortBy?.[0]?.key !== undefined ? sortBy?.[0]?.key : "",
        order: sortBy !== undefined && sortBy?.[0]?.order !== undefined ? sortBy?.[0]?.order : "",
        search: search || ''
    };
    loading.value = true;
    const res: StockResponse = await getStockList(params);
    rows.value = res.data;
    totalItems.value = res.total;
    loading.value = false;
}

const handleFavorite = (item: StockRow) => {
    const flag = item.follow == 1 || item.follow == '1' ? 0 : 1;
    get(`/api/stock/follow/${item.code}/${flag}`).then(() => {
        loadItems(params);
        showSnackbar.value = true;
        tips_favorite.value =  flag==0? '已取消关注' : '已关注该股票';
    });
}

onMounted(() => {
    loadItems({ page: 1, itemsPerPage: 10 });
})
onBeforeUnmount(() => {
    rows.value = [];
})
</script>
