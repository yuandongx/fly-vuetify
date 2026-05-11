<template>
  <div class="stock-header">
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
          placeholder="搜索股票名称/代码..."
          prepend-inner-icon="mdi-magnify"
          style="min-width: 260px; max-width: 340px"
          variant="solo-filled"
          rounded="lg"
          @click:clear="onClear"
          @keyup.enter="onSearch"
        >
          <template #append-inner>
            <v-icon v-if="!loading" class="search-icon" icon="mdi-magnify" @click="onSearch" />
          </template>
        </v-text-field>

        <!-- 市场筛选按钮组 -->
        <v-btn-toggle
          v-model="selectAreas"
          class="market-toggle"
          color="white"
          density="comfortable"
          divided
          mandatory
          variant="outlined"
          rounded="lg"
          @update:model-value="updateSelectAreas"
        >
          <v-btn value="sh">
            <v-icon icon="mdi-home" size="x-small" start />
            上证
          </v-btn>
          <v-btn value="sz">
            <v-icon icon="mdi-home-city" size="x-small" start />
            深证
          </v-btn>
          <v-btn value="bj">
            <v-icon icon="mdi-office-building" size="x-small" start />
            北证
          </v-btn>
        </v-btn-toggle>
      </div>
      <div class="header-stats">
        <v-chip color="primary" size="comfortable" variant="tonal" rounded="pill">
          <v-icon icon="mdi-refresh" size="x-small" start />
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
      default: () => {},
    },
    onSelectAreas: {
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

  function updateSelectAreas () {
    props.onSelectAreas(selectAreas.value.join(','))
  }
</script>

<style scoped>
.stock-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.header-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-stats .v-chip {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
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

.market-toggle {
  border-color: rgba(255, 255, 255, 0.5) !important;
}

.market-toggle :deep(.v-btn) {
  color: white !important;
  text-transform: none;
}

.market-toggle :deep(.v-btn--active) {
  background: rgba(255, 255, 255, 0.3) !important;
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
