<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <slot name="toolbar"> 
          <v-toolbar>
            <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
            
              <v-toolbar-title>更多详情</v-toolbar-title>
            

            <v-toolbar-items>
              <v-btn text="确定" variant="text" @click="dialog = false"></v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </slot>
        <slot name="info"></slot>
        <slot name="monitor-info"></slot>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { shallowRef } from 'vue'
const dialog = defineModel({ required: true, default: false })
const notifications = shallowRef(false)
const sound = shallowRef(true)
const widgets = shallowRef(false)
</script>