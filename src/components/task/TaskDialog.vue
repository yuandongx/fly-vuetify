<template>
  <v-dialog v-model="dialogVisible" max-width="520" persistent>
    <v-card class="task-dialog">
      <div class="dialog-header">
        <div class="d-flex align-center">
          <v-icon :icon="isEditing ? 'mdi-pencil-circle' : 'mdi-plus-circle'" :color="isEditing ? 'primary' : 'success'" class="mr-3"></v-icon>
          <div>
            <div class="text-h6">{{ isEditing ? '更新' : '新增' }}监控任务</div>
            <div class="text-caption text-grey">{{ isEditing ? '修改监控配置' : '创建新的监控任务' }}</div>
          </div>
        </div>
        <v-btn icon variant="text" size="small" @click="dialogVisible = false">
          <v-icon icon="mdi-close"></v-icon>
        </v-btn>
      </div>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <div class="form-section">
          <label class="form-label">
            <v-icon icon="mdi-stock" size="small" class="mr-1"></v-icon>
            选择股票/基金
          </label>
          <StockSelect v-model="formData.stock" :items="stockItems"></StockSelect>
        </div>

        <div class="form-section mt-6">
          <div class="d-flex align-center justify-space-between mb-3">
            <label class="form-label mb-0">
              <v-icon icon="mdi-bell-ring" size="small" class="mr-1"></v-icon>
              提醒策略
            </label>
            <v-btn
              v-if="formData.noticeConfigs?.length < 3"
              variant="tonal"
              color="primary"
              size="small"
              @click="$emit('add-notice')"
            >
              <v-icon start icon="mdi-plus" size="small"></v-icon>
              添加策略
            </v-btn>
          </div>
          <NoticeConfigList
            :configs="formData.noticeConfigs"
            @add="$emit('add-notice')"
            @remove="$emit('remove-notice', $event)">
          </NoticeConfigList>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-btn variant="text" @click="dialogVisible = false">
          <v-icon start icon="mdi-close"></v-icon>
          取消
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" @click="handleSave">
          <v-icon start icon="mdi-check"></v-icon>
          保存
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

<style scoped>
.task-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.form-section {
  position: relative;
}

.form-label {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 8px;
}
</style>
