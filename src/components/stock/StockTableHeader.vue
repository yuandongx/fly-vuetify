<template>
  <div class="stock-header">
    <div class="header-content">
      <div class="d-flex align-center flex-wrap ga-4">
        <!-- 搜索框 -->
        <v-text-field
          v-model="searchValue"
          class="search-field"
          clearable
          density="compact"
          hide-details
          :loading="loading"
          placeholder="搜索股票名称/代码..."
          prepend-inner-icon="mdi-magnify"
          style="max-width: 280px"
          variant="outlined"
          @click:clear="onClear"
          @keyup.enter="onSearch"
        >
          <template #append-inner>
            <v-icon v-if="!loading" class="search-icon" icon="mdi-magnify" @click="onSearch" />
          </template>
        </v-text-field>

        <!-- 市场筛选按钮组 -->
        <div class="d-flex ga-2">
          <v-btn-toggle
            v-model="selectAreas"
            color="primary"
            density="compact"
            divided
            mandatory
            variant="outlined"
            @update:model-value="updateSelectAreas"
          >
            <v-btn size="small" value="sh">
              <v-icon icon="mdi-home" size="x-small" start />
              上证
            </v-btn>
            <v-btn size="small" value="sz">
              <v-icon icon="mdi-home-city" size="x-small" start />
              深证
            </v-btn>
            <v-btn size="small" value="bj">
              <v-icon icon="mdi-office-building" size="x-small" start />
              北证
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>
      <div class="header-stats">
        <v-chip color="primary" size="small" variant="tonal">
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
