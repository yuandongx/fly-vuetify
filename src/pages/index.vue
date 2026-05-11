<template>
  <div class="index-page">
    <v-sheet border class="index-container">
      <!-- 市场指数 -->
      <MarketIndices />

      <v-divider></v-divider>

      <!-- 股票排名 -->
      <StockRanking />
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import MarketIndices from '@/components/index/MarketIndices.vue'
import StockRanking from '@/components/index/StockRanking.vue'
</script>

<style scoped>
.index-page {
  padding: 16px;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

.index-container {
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: white;
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 16px;
}
</style>
