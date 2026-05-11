<template>
  <v-sheet border class="pa-3 mb-2" color="grey-lighten-4" rounded>
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-subtitle-2 text-medium-emphasis">预警 {{ index + 1 }}</span>
      <v-btn
        v-if="showRemove"
        color="error"
        icon="mdi-close"
        size="x-small"
        variant="text"
        @click="$emit('remove')"
      />
    </div>
    <v-row dense>
      <v-col cols="12" md="6">
        <v-select
          v-model="localNoticeType"
          density="compact"
          item-title="label"
          item-value="value"
          :items="noticeTypeOptions"
          label="预警类型"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model.number="localNoticeValue"
          density="compact"
          :label="`预警${localNoticeUnit === 'percent' ? '百分比' : '价格'}`"
          :suffix="localNoticeUnit === 'percent' ? '%' : '元'"
          type="number"
        />
      </v-col>

      <v-col cols="12">
        <v-btn-toggle
          v-model="localNoticeUnit"
          color="primary"
          density="compact"
          mandatory
          variant="outlined"
        >
          <v-btn text="百分比" value="percent" />
          <v-btn text="固定价格" value="price" />
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
    set: val => emit('update:modelValue', { ...props.modelValue, noticeType: val }),
  })

  const localNoticeValue = computed({
    get: () => props.modelValue.noticeValue,
    set: val => emit('update:modelValue', { ...props.modelValue, noticeValue: val }),
  })

  const localNoticeUnit = computed({
    get: () => props.modelValue.noticeUnit,
    set: val => emit('update:modelValue', { ...props.modelValue, noticeUnit: val }),
  })
</script>
