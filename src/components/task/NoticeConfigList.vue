<template>
  <v-sheet border class="pa-3" rounded>
    <div class="d-flex align-center justify-space-between mb-3">
      <span class="text-subtitle-2">涨跌预警设置</span>
      <v-btn
        v-if="configs.length < 3"
        color="primary"
        prepend-icon="mdi-plus"
        size="small"
        variant="tonal"
        @click="$emit('add')"
      >添加预警</v-btn>
    </div>
    <NoticeInput
      v-for="(config, index) in configs"
      :key="index"
      v-model="configs[index]"
      :index="index"
      :show-remove="configs.length > 1"
      @remove="$emit('remove', index)"
    />
  </v-sheet>
</template>

<script setup>
  defineProps({
    configs: {
      type: Array,
      required: true,
    },
  })

  defineEmits(['add', 'remove'])
</script>
