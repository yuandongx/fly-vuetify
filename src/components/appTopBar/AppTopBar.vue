<template>
  <v-app-bar :elevation="6">
    <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>
    <template v-slot:image>
        <v-img
        gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
        ></v-img>
    </template>
    <AppTopMenu />
    <v-spacer />
    <v-btn>Login</v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
  //
</script>