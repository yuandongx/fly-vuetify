<template>
  <v-app-bar class="app-top-bar" :elevation="2">
    <template #prepend>
      <v-app-bar-nav-icon />
    </template>
    <AppTopMenu />
    <v-spacer />
    <v-btn class="login-btn" color="white" variant="tonal">
      <v-icon icon="mdi-account-circle-outline" start />
      登录
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
  //
</script>

<style scoped>
.app-top-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
}

.app-top-bar :deep(.v-app-bar-nav-icon),
.app-top-bar :deep(.v-btn) {
  color: white !important;
}

.login-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(10px);
  text-transform: none;
  font-weight: 500;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
}
</style>
