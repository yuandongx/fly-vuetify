<template>
  <div class="fund-search-bar">
    <div class="header-content">
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
          variant="outlined"
          color="white"
          size="small"
          :loading="refreshing"
          @click="onRefresh"
          class="refresh-btn"
        >
          <v-icon start icon="mdi-refresh"></v-icon>
          刷新数据
        </v-btn>

        <!-- 数据更新时间 -->
        <v-chip size="small" variant="flat" class="update-chip">
          <v-icon start icon="mdi-clock-outline" size="x-small"></v-icon>
          每10秒自动更新
        </v-chip>
      </div>
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
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  padding: 16px 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
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

.refresh-btn {
  border-color: rgba(255, 255, 255, 0.5) !important;
  color: white !important;
  text-transform: none;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
}

.update-chip {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}
</style>
