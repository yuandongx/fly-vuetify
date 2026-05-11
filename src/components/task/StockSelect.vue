<template>
  <v-autocomplete
    v-model="selectedStock"
    auto-select-first
    clearable
    hide-no-data
    item-title="displayName"
    item-value="code"
    :items="items"
    label="选择股票/基金"
    density="compact"
    no-data-text="无匹配股票/基金"
    placeholder="输入股票代码或名称搜索"
    prepend-inner-icon="mdi-magnify"
    return-object
    variant="outlined"
  />
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Object,
      default: null,
    },
    items: {
      type: Array,
      default: () => [],
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const selectedStock = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })
</script>
