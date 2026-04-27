<template>
  <v-sheet border rounded class="pa-3 mb-2" color="grey-lighten-4">
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-subtitle-2 text-medium-emphasis">预警 {{ index + 1 }}</span>
      <v-btn 
        v-if="showRemove"
        icon="mdi-close" 
        size="x-small" 
        variant="text" 
        color="error"
        @click="$emit('remove')"></v-btn>
    </div>
    <v-row dense>
      <v-col cols="12" md="6">
        <v-select 
          v-model="localNoticeType" 
          :items="noticeTypeOptions"
          item-title="label"
          item-value="value"
          label="预警类型"
          density="compact"></v-select>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field 
          v-model.number="localNoticeValue" 
          type="number"
          :suffix="localNoticeUnit === 'percent' ? '%' : '元'"
          :label="`预警${localNoticeUnit === 'percent' ? '百分比' : '价格'}`"
          density="compact"></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-btn-toggle v-model="localNoticeUnit" mandatory color="primary" variant="outlined" density="compact">
          <v-btn value="percent" text="百分比"></v-btn>
          <v-btn value="price" text="固定价格"></v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      noticeType: 'rise',
      noticeUnit: 'percent',
      noticeValue: 5,
    }),
  },
  index: {
    type: Number,
    default: 0,
  },
  showRemove: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'remove'])

const noticeTypeOptions = [
  { label: '上涨预警', value: 'rise' },
  { label: '下跌预警', value: 'fall' },
  { label: '双向预警', value: 'both' },
]

const localNoticeType = computed({
  get: () => props.modelValue.noticeType,
  set: (val) => emit('update:modelValue', { ...props.modelValue, noticeType: val }),
})

const localNoticeValue = computed({
  get: () => props.modelValue.noticeValue,
  set: (val) => emit('update:modelValue', { ...props.modelValue, noticeValue: val }),
})

const localNoticeUnit = computed({
  get: () => props.modelValue.noticeUnit,
  set: (val) => emit('update:modelValue', { ...props.modelValue, noticeUnit: val }),
})
</script>
