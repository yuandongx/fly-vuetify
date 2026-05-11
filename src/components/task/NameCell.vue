<template>
  <v-chip border="thin opacity-25" label prepend-icon="mdi-book" :text="value">
    <template #prepend>
      <v-icon color="medium-emphasis" />
    </template>
  </v-chip>
</template>

<script setup>
  defineProps({
    value: {
      type: String,
      required: true,
    },
  })
</script>
