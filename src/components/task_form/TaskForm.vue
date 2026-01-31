<template>
    
        <v-container>
            <v-row v-for="args in taskArgs" :key="args.key">
                <v-col cols="3">
                    <v-radio-group inline :model-value="args.flag"
                     @update:model-value="(value) => updateArgs(args.key, {flag: value})">
                    <v-radio label="上涨" value="up"></v-radio>
                    <v-radio label="下跌" value="down"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col cols="3">
                    <v-number-input control-variant="stacked"
                        @update:model-value="(val) => updateArgs(args.key, {value: val})"
                        :label="args.label"
                        density="compact"
                        :max-width="180"
                        :model-value="args.value"
                        :max="100"
                        :min="0.1"
                        :step="0.1"
                        :precision="2"
                        />
                </v-col>
                <v-col cols="3">
                    <v-number-input control-variant="stacked"
                    label="间隔分钟"
                    @update:model-value="(val) => updateArgs(args.key, {interval: val})"
                    density="compact"
                        :model-value="args.interval"
                        :max="10080"
                        :min="1"
                        :step="1"
                        />
                </v-col>
            </v-row>
            <v-btn block color="primary" @click="addOneItem" :disabled="cantAdd">Submit Task</v-btn>
        </v-container>
    
</template>
<script setup lang="ts">
import type { TaskArgs, TaskArgItem } from '@/types/task'
import type { PropType } from 'vue';
const flagLabel = (flag: "up"|"down"|null) => {
    if (flag === "up") {
        return "上涨"
    } else if (flag === "down") {
        return "下跌"
    } else {
        return "未选择"
    }
}

const props = defineProps({
    initialArgs: {
        type: Object as PropType<TaskArgs>,
        default: () => ([] as TaskArgs)
    }
})
const cantAdd = computed(() => {
    return taskArgs.value.length >= 5
})
const taskArgs = ref<TaskArgs>(props.initialArgs)
const addOneItem = () => {
    const newItem: TaskArgItem = {
        flag: "down",
        value: null,
        interval: null,
        label: '下跌',
        key: Date.now()
    }

    taskArgs.value = [...taskArgs.value, newItem]
    console.log(taskArgs.value)
} 
const updateArgs = (key: number, value: any) => {
    console.log(key, value)
    taskArgs.value = taskArgs.value.map(item => {
        if (item.key === key) {
            const newItem = {...item, ...value}
            const label = flagLabel(newItem.flag)
            return {...newItem, label}
        }
        return item
    })
} 
</script>