<template>
  <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-book" label>
    <template v-slot:prepend>
      <v-icon color="medium-emphasis"></v-icon>
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
