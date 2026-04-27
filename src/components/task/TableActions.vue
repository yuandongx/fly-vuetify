<template>
  <div class="d-flex ga-2 justify-end">
    <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="$emit('edit', id)"></v-icon>
    <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="$emit('delete', id)"></v-icon>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
})

defineEmits(['edit', 'delete'])
</script>
