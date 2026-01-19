<template>
    <tr :key="item.id">
        <td v-for="item in rowItem" :key="`${item.key}-${item.value}`">
            {{ item.value }}
        </td>
        <td>
         <div class="d-flex ga-2 justify-start">
            <v-icon :color="favoriteColor" icon="mdi-heart" size="small" @click="favorite(item.id)"></v-icon>
            <v-icon color="medium-emphasis" icon="mdi-dots-horizontal" size="small" @click="more(item.id)"></v-icon>
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
    onHandleMore: {
        type: Function as PropType<(item: TableRow) => void>,
        default: () => {},
    }
})
const rowItem = computed(() => {
    const rtn = [] as {key: string, value: string|number}[]
    props.headers.forEach(element => {
        const value = props.item[element.key]
        if (value != undefined) {
            rtn.push({key: element.key, value: value})
        }
    }); 
    return rtn
})
const favoriteColor = computed(() => {
    console.log(props.item.follow, typeof props.item.follow)
    return props.item.follow == 1 || props.item.follow == '1' ? 'red' : 'medium-emphasis'
})
const favorite = (id: string|number|undefined) => {
    props.onHandleMore(props.item)
}
const more = (id: string|number|undefined) => {
    props.onHandleMore(props.item)
}
</script>