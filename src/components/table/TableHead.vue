<template>
    <thead>
        <tr>
            <th v-for="item in headers" :key="item.key">{{ item.title }}</th>
        </tr>
    </thead>
</template>
<script setup lang="ts">

import type { TableHead } from '@/types/stock';
const props = defineProps({
    headers: {
        type: Array as PropType<TableHead[]>,
        default: () => []
    }
})
</script>
