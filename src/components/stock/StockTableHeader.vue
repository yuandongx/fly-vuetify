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
                v-model="search"
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
const search = ref('')
const props = defineProps({
    search: {
        type: Function,
        default: ()=>''
    },
    selectAreas: {
        type: Function,
        default: () => ['sh', 'sz', 'bj']
    }
})
const onClick = () => {
    loading.value = true;
    props.search(search.value);
    loading.value = false;
    console.log('click search icon');
}
const updateSelectAreas = () => {
    props.selectAreas(selectAreas.value.join(','));
    console.log("================",  selectAreas.value);
}
</script>