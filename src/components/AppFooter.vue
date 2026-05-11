<template>
  <v-footer app class="app-footer" height="48">
    <div class="footer-content">
      <div class="footer-left">
        <v-icon class="mr-1" icon="mdi-chart-line" size="small" />
        <span class="text-caption">智能股票监控系统</span>
      </div>
      <div class="footer-right">
        <span class="text-caption text-grey">
          数据仅供参考，不构成投资建议
        </span>
      </div>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
  //
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 16px;
}

.footer-left {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.6);
}
</style>
