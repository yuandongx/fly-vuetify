<template>
  <v-menu v-if="menuItem.children && menuItem.children.length > 0">
    <template #activator="{ props }">
      <v-btn v-bind="props" class="menu-btn" variant="text">{{ menuItem.label }}</v-btn>
    </template>
    <v-list class="menu-list" density="compact">
      <v-list-item v-for="item in menuItem.children" :key="item.key" class="menu-item" :to="item.to">
        <!-- <template #prepend>
          <v-icon class="mr-2" :icon="getIcon(item.key)" size="small" />
        </template> -->
        {{ item.label }}
      </v-list-item>
    </v-list>
  </v-menu>
  <v-btn v-else class="menu-btn" :to="menuItem.to" variant="text">{{ menuItem.label }}</v-btn>
</template>

<script lang="ts" setup>
  import type { MenuItem } from '@/vars/menuItems'
  const props = defineProps({
    menuItem: {
      type: Object as () => MenuItem,
      default: () => ({}),
    },
  })

  function getIcon (key: string) {
    const iconMap: Record<string, string> = {
      stock: 'mdi-chart-line',
      fund: 'mdi-piggybank',
      task: 'mdi-robot',
      follow: 'mdi-star',
    }
    return iconMap[key] || 'mdi-circle-small'
  }
</script>

<style scoped>
.menu-btn {
  color: white !important;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
}

.menu-list {
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  min-width: 140px;
}

.menu-item {
  transition: all 0.2s ease;
  min-height: 38px;
  font-size: 13px;
}

.menu-item:hover {
  background: rgba(102, 126, 234, 0.12) !important;
}
</style>
