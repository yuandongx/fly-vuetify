<template>
  <v-dialog v-model="dialogVisible" max-width="520" persistent>
    <v-card class="task-dialog">
      <div class="dialog-header">
        <div class="d-flex align-center">
          <v-icon class="mr-3" :color="isEditing ? 'primary' : 'success'" :icon="isEditing ? 'mdi-pencil-circle' : 'mdi-plus-circle'" />
          <div>
            <div class="text-h6">{{ isEditing ? '更新' : '新增' }}监控任务</div>
            <div class="text-caption text-grey">{{ isEditing ? '修改监控配置' : '创建新的监控任务' }}</div>
          </div>
        </div>
        <v-btn icon size="small" variant="text" @click="dialogVisible = false">
          <v-icon icon="mdi-close" />
        </v-btn>
      </div>

      <v-divider />

      <v-card-text class="pa-6">
        <div class="form-section">
          <label class="form-label">
            <v-icon class="mr-1" icon="mdi-stock" size="small" />
            选择股票/基金
          </label>
          <StockSelect v-model="formData.stock" :items="stockItems" />
        </div>

        <div class="form-section mt-6">
          <div class="d-flex align-center justify-space-between mb-3">
            <label class="form-label mb-0">
              <v-icon class="mr-1" icon="mdi-bell-ring" size="small" />
              提醒策略
            </label>
            <v-btn
              v-if="formData.noticeConfigs?.length < 3"
              color="primary"
              size="small"
              variant="tonal"
              @click="$emit('add-notice')"
            >
              <v-icon icon="mdi-plus" size="small" start />
              添加策略
            </v-btn>
          </div>
          <NoticeConfigList
            :configs="formData.noticeConfigs"
            @add="$emit('add-notice')"
            @remove="$emit('remove-notice', $event)"
          />
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn variant="text" @click="dialogVisible = false">
          <v-icon icon="mdi-close" start />
          取消
        </v-btn>
        <v-spacer />
        <v-btn color="primary" variant="flat" @click="handleSave">
          <v-icon icon="mdi-check" start />
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
    set: val => emit('update:modelValue', val),
  })

  function handleSave () {
    emit('save')
    dialogVisible.value = false
  }
</script>

<style scoped>
.task-dialog {
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.dialog-header .text-grey {
  color: rgba(255, 255, 255, 0.8) !important;
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
