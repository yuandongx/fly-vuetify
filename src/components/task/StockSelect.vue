<template>
  <v-autocomplete 
    v-model="selectedStock" 
    auto-select-first
    :items="items"
    item-title="displayName"
    item-value="code"
    return-object
    clearable
    hide-no-data
    no-data-text="无匹配股票/基金"
    prepend-inner-icon="mdi-magnify"
    placeholder="输入股票代码或名称搜索"
    label="选择股票/基金"
    density="compact"
    variant="outlined"></v-autocomplete>
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
  set: (val) => emit('update:modelValue', val),
})
</script>
