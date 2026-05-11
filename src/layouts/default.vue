<template>
  <v-responsive class="app-wrapper">
    <v-app>
      <AppTopBar />
      <v-main class="main-content">
        <router-view />
      </v-main>
      <AppFooter />
    </v-app>
  </v-responsive>
</template>

<script lang="ts" setup>
  //
</script>

<style scoped>
.app-wrapper {
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  min-height: 100vh;
}

.main-content {
  background: transparent;
}
</style>
