<template>
  <div class="fund-page">
    <v-sheet border class="fund-container">
      <!-- 基金表格 -->
      <fund-table :data-headers="fundRankHeader" data-source-path="/api/fund/rank" />
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
  import { fundRankHeader } from '@/vars/fund'
</script>

<style scoped>
.fund-page {
  padding: 16px;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

.fund-container {
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: white;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
