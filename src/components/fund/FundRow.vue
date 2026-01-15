<template>
    <tr :key="item.id">
        <td v-for="header in headers" :key="`${item.id}-${header.key}`">
            {{ item[header.key] }}
        </td>
        <td>
         <div class="d-flex ga-2 justify-start">
            <v-icon :color="favoriteColor" icon="mdi-heart" size="small" @click="edit(item.id)"></v-icon>
            <v-icon color="medium-emphasis" icon="mdi-dots-horizontal" size="small" @click="remove(item.id)"></v-icon>
        </div>
        </td>
    </tr>
</template>
<script setup lang="ts">
import { type TableColumn, type TableRow } from '@/types/table'

const props = defineProps({
    item: {
        type: Object as PropType<TableRow>,
        default: () => {},
    },
    headers: {
        type: Array as PropType<TableColumn[]>,
        default: () => [],
    },
})
const favoriteColor = computed(() => {
    return props.item.favorite == 1 ? 'medium-emphasis' : 'red'
})
const edit = (id: string|number|undefined) => {}
const remove = (id: string|number|undefined) => {}
</script>