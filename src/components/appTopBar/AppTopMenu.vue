<template>
  <AppTopMenuItem v-for="item in menuItems" :key="item.key" :menu-item="item" />
</template>

<script lang="ts" setup>
import { menuItems } from '@/vars/menuItems'
</script>