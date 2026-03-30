<template>
  <v-menu v-if="menuItem.children && menuItem.children.length > 0">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props">{{ menuItem.label }}</v-btn>
    </template>
    <v-list>
      <v-list-item v-for="item in menuItem.children" :key="item.key" :to="item.to">
        {{ item.label }}
      </v-list-item>
    </v-list>
  </v-menu>
  <v-btn v-else :to="menuItem.to">{{ menuItem.label }}</v-btn>

</template>

<script lang="ts" setup>
import { type MenuItem } from '@/vars/menuItems'
const props = defineProps({
  menuItem: {
    type: Object as () => MenuItem,
    default: () => ({})
  }
})
</script>