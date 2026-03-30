<template>
    <v-sheet rounded="lg" border>
        <v-table density="compact">
            <tbody class="bg-surface-light">
                <tr>
                    <th v-for="header in historyColumns" :key="header.id">{{ header.title }}</th>
                </tr>
            </tbody>

            <tbody>
                <tr v-for="row in rowData" :key="row.id">
                    <td class="py-2" v-for="header in historyColumns" :key="header.id">{{ getValue(row, header.key) }}</td>
                </tr>
            </tbody>
        </v-table>
    </v-sheet>
</template>
<script setup lang="ts">
import { historyColumns } from '@/vars/task'
import type { TaskHistory } from '@/types/task';
const props = defineProps({
    rowData: {
        type: Array<TaskHistory>,
        required: true
    }
})

function getValue(row: TaskHistory, key: string) {
    return (row as any)[key];
}
</script>