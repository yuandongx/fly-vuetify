<template>
  <div class="follow-page">
    <v-sheet border class="follow-container">
      <!-- 基金表格 -->
      <FundTable data-source-path="/api/fund/favorite" />
    </v-sheet>
  </div>
</template>

<style scoped>
.follow-page {
  padding: 16px;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

.follow-container {
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: white;
  max-width: 1400px;
  margin: 0 auto;
}
</style>