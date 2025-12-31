<template>
    <tr>
        <td v-for="item in headers" :key="`${item.key}-${rows[item.key]}`">{{ rows[item.key] }}</td>
    </tr>
</template>
<script setup lang="ts">
import type { StockRow, TableHead } from '@/types/stock';

const props = defineProps({
    rows: {
        type: Object as PropType<StockRow>,
        default: () => ({})
    },
    headers: {
        type: Array as PropType<TableHead[]>,
        default: () => []
    }
})
</script>