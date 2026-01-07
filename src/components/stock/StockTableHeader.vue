<template>
    <v-container>
        <v-row>
            <v-col cols="4">
                <v-text-field
                :loading="loading"
                append-inner-icon="mdi-magnify"
                density="compact"
                label="Search ..."
                variant="solo"
                hide-details
                single-line
                @click:append-inner="onClick"
            ></v-text-field>
            </v-col>
            <v-col cols="1" align="center">
                <v-checkbox
                    v-model="selectAreas"
                    label="SH"
                    value="sh"
                    density="compact"
                    @update:model-value="updateSelectAreas"
                />
            </v-col>
            <v-col cols="1" align="center">
                <v-checkbox
                    v-model="selectAreas"
                    label="SZ"
                    value="sz"
                    density="compact"
                    @update:model-value="updateSelectAreas"
                />
            </v-col>
            <v-col cols="1" align="center">
                <v-checkbox
                    v-model="selectAreas"
                    label="BJ"
                    value="bj"
                    density="compact"
                    @update:model-value="updateSelectAreas"
                />
            </v-col>
            <v-col cols="1" align="center">
            
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(false)
const selectAreas = ref(['sh', 'sz', 'bj'])

const onClick = () => {
    loading.value = true;
    console.log('------->', selectAreas.value);
}
const updateSelectAreas = () => {
    console.log('------->', selectAreas.value);
}
</script>