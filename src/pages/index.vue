<template>
  <v-container fluid class="pa-4">
    <MarketIndices />
    <StockRanking />
  </v-container>
</template>

<script setup lang="ts">
import MarketIndices from '@/components/index/MarketIndices.vue'
import StockRanking from '@/components/index/StockRanking.vue'
</script>
