<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="600">
      <v-card class="more-info-card">
        <div class="info-toolbar">
          <div class="d-flex align-center">
            <v-icon icon="mdi-information-outline" class="mr-2"></v-icon>
            <span class="text-h6">详情信息</span>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
        </div>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <slot name="info"></slot>
        </v-card-text>
        <v-divider></v-divider>
        <div class="pa-4">
          <slot name="monitor-info"></slot>
        </div>
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

<style scoped>
.more-info-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.info-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.info-toolbar .v-btn {
  color: white !important;
}
</style>