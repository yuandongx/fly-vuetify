<template>
  <div class="table-actions">
    <v-btn
      color="primary"
      icon
      size="small"
      variant="text"
      @click="$emit('edit', id)"
    >
      <v-icon icon="mdi-pencil-outline" size="18" />
      <v-tooltip activator="parent" location="top">编辑</v-tooltip>
    </v-btn>
    <v-btn
      color="error"
      icon
      size="small"
      variant="text"
      @click="$emit('delete', id)"
    >
      <v-icon icon="mdi-delete-outline" size="18" />
      <v-tooltip activator="parent" location="top">删除</v-tooltip>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    id: {
      type: [Number, String],
      required: false,
    },
  })

  defineEmits(['edit', 'delete'])
</script>

<style scoped>
.table-actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

.table-actions :deep(.v-btn) {
  opacity: 0.6;
  transition: all 0.2s ease;
}

.table-actions :deep(.v-btn:hover) {
  opacity: 1;
  transform: scale(1.1);
}
</style>
