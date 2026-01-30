<template>
    <v-form v-model="vaild">
        <v-container>
            <v-row v-for="args in initialArgs" :key="args.key">
                <v-col cols="6" sm="6">
                    <v-text-field
                        label="Task Name"
                        required
                    ></v-text-field>
                </v-col>
                <v-col cols="6" sm="6">
                    <v-text-field
                        label="Due Date"
                        type="date"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-textarea
                        label="Description"
                        rows="4"
                    ></v-textarea>
                </v-col>
                <v-col cols="12" class="d-flex justify-end">
                    <v-btn color="primary" :disabled="!vaild">Submit</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>
<script setup lang="ts">
import type { TaskArgs, TaskArgItem } from '@/types/task'
import type { PropType } from 'vue';
const vaild = ref(false)
const props = defineProps({
    initialArgs: {
        type: Object as PropType<TaskArgs>,
        default: () => ({})
    }
})
</script>