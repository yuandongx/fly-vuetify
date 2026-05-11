<template>
  <div class="stock-page">
    <v-sheet border class="stock-container">
      <!-- 股票表格 -->
      <stock-table />
    </v-sheet>
  </div>
</template>

<style scoped>
.stock-page {
  padding: 16px;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

.stock-container {
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: white;
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 16px;
}
</style>
