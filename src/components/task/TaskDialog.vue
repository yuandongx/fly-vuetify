<template>
  <v-dialog v-model="dialogVisible" max-width="500">
    <v-card :subtitle="`${isEditing ? '更新' : '增加'}监控任务`" :title="`${isEditing ? '更新' : '增加'}监控任务`">
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <StockSelect v-model="formData.stock" :items="stockItems"></StockSelect>
          </v-col>

          <v-col cols="12">
            <NoticeConfigList 
              :configs="formData.noticeConfigs"
              @add="$emit('add-notice')"
              @remove="$emit('remove-notice', $event)"></NoticeConfigList>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="取消" variant="plain" @click="dialogVisible = false"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="保存" @click="handleSave"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  formData: {
    type: Object,
    required: true,
  },
  stockItems: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'save', 'add-notice', 'remove-notice'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function handleSave() {
  emit('save')
  dialogVisible.value = false
}
</script>
