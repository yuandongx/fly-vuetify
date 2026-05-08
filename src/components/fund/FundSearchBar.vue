<template>
  <div class="fund-search-bar pa-4 rounded-t-lg">
    <div class="d-flex align-center flex-wrap ga-4">
      <!-- 搜索框 -->
      <v-text-field
        v-model="searchValue"
        :loading="loading"
        density="compact"
        placeholder="搜索基金名称/代码..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        class="search-field"
        style="max-width: 320px"
        @keyup.enter="onSearch"
        clearable
        @click:clear="onClear"
      >
        <template #append-inner>
          <v-icon v-if="!loading" icon="mdi-magnify" class="search-icon" @click="onSearch"></v-icon>
        </template>
      </v-text-field>

      <!-- 刷新按钮 -->
      <v-btn
        variant="tonal"
        color="primary"
        size="small"
        :loading="refreshing"
        @click="onRefresh"
      >
        <v-icon start icon="mdi-refresh"></v-icon>
        刷新数据
      </v-btn>

      <!-- 数据更新时间 -->
      <span class="text-body-2 text-grey ml-auto">
        <v-icon icon="mdi-clock-outline" size="x-small" class="mr-1"></v-icon>
        每10秒自动更新
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const refreshing = ref(false)
const searchValue = ref('')

const props = defineProps({
  onSearch: {
    type: Function,
    default: () => {}
  },
  onRefresh: {
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

const onRefresh = () => {
  refreshing.value = true
  props.onRefresh()
  setTimeout(() => {
    refreshing.value = false
  }, 500)
}
</script>

<style scoped>
.fund-search-bar {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-bottom: none;
}

.search-field :deep(.v-field) {
  border-radius: 8px;
}

.search-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
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
