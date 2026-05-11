<template>
  <div class="fund-search-bar">
    <div class="header-content">
      <div class="d-flex align-center flex-wrap ga-6 filter-controls">
        <!-- 搜索框 -->
        <v-text-field
          v-model="searchValue"
          class="search-field"
          clearable
          density="comfortable"
          hide-details
          :loading="loading"
          placeholder="搜索基金名称/代码..."
          prepend-inner-icon="mdi-magnify"
          style="min-width: 260px; max-width: 360px"
          variant="solo-filled"
          rounded="lg"
          @click:clear="onClear"
          @keyup.enter="onSearch"
        >
          <template #append-inner>
            <v-icon v-if="!loading" class="search-icon" icon="mdi-magnify" @click="onSearch" />
          </template>
        </v-text-field>

        <!-- 刷新按钮 -->
        <v-btn
          class="refresh-btn"
          color="white"
          :loading="refreshing"
          size="comfortable"
          variant="outlined"
          rounded="lg"
          @click="onRefresh"
        >
          <v-icon icon="mdi-refresh" start />
          刷新
        </v-btn>

        <!-- 数据更新时间 -->
        <v-chip class="update-chip" size="comfortable" variant="flat" rounded="lg">
          <v-icon icon="mdi-clock-outline" size="x-small" start />
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
      default: () => {},
    },
    onRefresh: {
      type: Function,
      default: () => {},
    },
  })

  function onSearch () {
    loading.value = true
    props.onSearch(searchValue.value)
    setTimeout(() => {
      loading.value = false
    }, 300)
  }

  function onClear () {
    props.onSearch('')
  }

  function onRefresh () {
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
  padding: 20px 24px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.filter-controls {
  margin-left: -8px;
}

.search-field {
  font-size: 14px;
}

.search-field :deep(.v-field) {
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.search-field :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.search-field :deep(.v-field__input) {
  padding-top: 10px;
  padding-bottom: 10px;
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
