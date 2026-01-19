<template>
    <v-container>
        <v-row align="start" justify="start">
            <v-col cols="4" >
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
        </v-row>
    </v-container>  
</template>
<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(false)
const search = ref('')
const onClick = () => {
    loading.value = true;
    console.log('------->', search.value);
}
</script>