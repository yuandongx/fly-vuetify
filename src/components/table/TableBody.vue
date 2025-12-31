<template>

        <tbody>
            <table-row v-for="item in rows" :key="item.key" :rows="item" :headers="headers" />
        </tbody>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import TableRow from './TableRow.vue';
import type { StockRow as TypeTableRow, TableHead as TypeTableHead } from '@/types/stock';
const props = defineProps({
    rows: {
        type: Array as PropType<TypeTableRow[]>,
        default: () => []
    },
    headers: {
        type: Array as PropType<TypeTableHead[]>,
        default: () => []
    }
})
</script>