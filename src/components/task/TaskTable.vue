<template>
    <v-data-table-server :headers="headers" :items="tasks" :options="tableOptions" :loading="loading"
        :items-length="tasks_length" class="task-table">

        <template v-slot:item.data-table-expand="{internalItem, isExpanded, toggleExpand }">
            <div class="d-flex ga-2 justify-start">   
                <v-icon  icon="mdi-refresh" size="small" ></v-icon>
                <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                        <v-icon color="medium-emphasis" v-bind="props" icon="mdi-dots-horizontal" size="small"></v-icon>
                    </template>
                    <v-list>
                        <v-list-item @click="toggleExpand(internalItem)">
                            <v-list-item-title>历史</v-list-item-title>
                        </v-list-item>
                        <v-list-item >
                            <v-list-item-title>编辑</v-list-item-title>
                        </v-list-item>
                        <v-list-item >
                            <v-list-item-title>删除</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </template>

        <template v-slot:expanded-row="{ columns, item }">
            <tr>
                <td :colspan="columns.length" class="py-2">
                    <task-table-history-row :rowData="get_history(item)" />
                </td>
            </tr>
        </template>


    </v-data-table-server>
</template>
<script setup lang="ts">
import { columns } from '@/vars/task'
import { get } from '@/http/common'
import type { Params } from '@/types/common';
import type { TaskHistory, Task } from '@/types/task';
let intervalId: number | null = null
const loading = ref(true)
const tasks = ref<Task[]>([])
const tasks_length = ref(0)
const headers = [...columns, { id: 9999, key: 'data-table-expand', title: '操作' }];
const parms: Params = {
    page: '1',
    page_size: '10'
}

const map_data = (data: Array<any>): Array<Task> => {
    return data.map((item: any) => ({
        _id: item._id,
        id: item.id,
        name: item.name,
        desc: item.msg,
        start_time: item.start_time,
        end_time: item.end_time,
        next_time: item.next_time,
        duration: item.duration,
        status: item.status,
        error: item.error,
        interface_name: item.interface_name,
        collection: item.collection,
        trigger: item.trigger,
        msg: item.msg,
        histories: item.histories || []
    }))

}
const get_data = () => {
    get('/api/v1/task', parms).then((response) => {
        console.log('Response:', response, columns)
        tasks.value = map_data(response.data.data)
        tasks_length.value = response.data.total
        loading.value = false
    })
}
const tableOptions = ({ page, itemsPerPage, sortBy, search }: any) => {

}

const get_history = (item: any): TaskHistory[] => {
    const rows: TaskHistory[] = []
    let count = 0
    console.log('Getting history for item:', item)
    item.histories.forEach((historyItem: any) => {
        count += 1
        rows.push({
            id: `${item.id}_history_${count}`,
            name: historyItem.name,
            desc: historyItem.desc,
            start_time: historyItem.start_time,
            end_time: historyItem.end_time,
            duration: historyItem.duration,
            status: historyItem.status,
            error: historyItem.error
        })
    })
    return rows
}

// Initial data fetch and setup periodic refresh
onMounted(() => {
    get_data()
    intervalId = setInterval(() => {
        get_data()
    }, 5000)
})
// Cleanup on component unmount
onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
})
</script>