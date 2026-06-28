<route lang="yaml">
meta:
  layout: blank
</route>

<template>
  <div class="login-page">
    <v-card class="login-card pa-6" elevation="8" rounded="lg">
      <div class="text-center mb-6">
        <h2 class="text-h4 font-weight-bold text-primary">Fly Vuetify</h2>
        <p class="text-body-1 text-medium-emphasis mt-2">欢迎回来，请登录您的账号</p>
      </div>

      <v-form ref="formRef" @submit.prevent="handleLogin">
        <v-text-field
          v-model="username"
          label="用户名"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          :rules="[rules.required]"
          autocomplete="username"
          class="mb-3"
        />

        <v-text-field
          v-model="password"
          label="密码"
          prepend-inner-icon="mdi-lock"
          variant="outlined"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :rules="[rules.required]"
          autocomplete="current-password"
          class="mb-2"
          @click:append-inner="showPassword = !showPassword"
        />

        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          :loading="loading"
          class="mt-2"
          rounded="lg"
        >
          登 录
        </v-btn>
      </v-form>

      <v-snackbar
        v-model="showError"
        color="error"
        :timeout="3000"
        location="top"
      >
        {{ errorMessage }}
      </v-snackbar>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { login } from '@/http/auth'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  const formRef = ref()
  const username = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const loading = ref(false)
  const showError = ref(false)
  const errorMessage = ref('')

  const rules = {
    required: (v: string) => !!v || '此项为必填',
  }

  async function handleLogin() {
    const { valid } = await formRef.value.validate()
    if (!valid) return

    loading.value = true
    try {
      const res = await login(username.value, password.value)
      authStore.setToken(res.token)
      authStore.setUser({ username: res.username })
      router.push('/')
    } catch (e: any) {
      errorMessage.value = e?.message || '登录失败，请检查用户名和密码'
      showError.value = true
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  margin: 16px;
}
</style>
