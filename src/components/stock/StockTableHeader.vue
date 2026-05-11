<template>
  <div class="stock-header">
    <div class="header-content">
      <div class="d-flex align-center flex-wrap ga-4">
        <!-- 搜索框 -->
        <v-text-field
          v-model="searchValue"
          :loading="loading"
          density="compact"
          placeholder="搜索股票名称/代码..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          class="search-field"
          style="max-width: 280px"
          @keyup.enter="onSearch"
          clearable
          @click:clear="onClear"
        >
          <template #append-inner>
            <v-icon v-if="!loading" icon="mdi-magnify" class="search-icon" @click="onSearch"></v-icon>
          </template>
        </v-text-field>

        <!-- 市场筛选按钮组 -->
        <div class="d-flex ga-2">
          <v-btn-toggle
            v-model="selectAreas"
            color="primary"
            mandatory
            density="compact"
            variant="outlined"
            divided
            @update:model-value="updateSelectAreas"
          >
            <v-btn value="sh" size="small">
              <v-icon start icon="mdi-home" size="x-small"></v-icon>
              上证
            </v-btn>
            <v-btn value="sz" size="small">
              <v-icon start icon="mdi-home-city" size="x-small"></v-icon>
              深证
            </v-btn>
            <v-btn value="bj" size="small">
              <v-icon start icon="mdi-office-building" size="x-small"></v-icon>
              北证
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>
      <div class="header-stats">
        <v-chip size="small" color="primary" variant="tonal">
          <v-icon start icon="mdi-refresh" size="x-small"></v-icon>
          实时更新
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const selectAreas = ref(['sh', 'sz', 'bj'])
const searchValue = ref('')

const props = defineProps({
  onSearch: {
    type: Function,
    default: () => {}
  },
  onSelectAreas: {
    type: Function,
    default: () => {}
  }
})

const onSearch = () => {
  loading.value = true
  props.onSearch(searchValue.value)
  setTimeout(() => {
    loading.value = false
  }, 300)
}

const onClear = () => {
  props.onSearch('')
}

const updateSelectAreas = () => {
  props.onSelectAreas(selectAreas.value.join(','))
}
</script>

<style scoped>
.stock-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.header-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-stats .v-chip {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.search-field :deep(.v-field) {
  border-radius: 0;
  background: white;
}

.search-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.2;
}

.search-icon {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.search-icon:hover {
  opacity: 1;
}
</style>
