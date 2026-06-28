import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const TOKEN_KEY = 'auth_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(sessionStorage.getItem(TOKEN_KEY) || '')
  const user = ref<{ username: string } | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  /** 保存 token 到 sessionStorage */
  function setToken(newToken: string) {
    token.value = newToken
    sessionStorage.setItem(TOKEN_KEY, newToken)
  }

  /** 保存用户信息 */
  function setUser(userData: { username: string }) {
    user.value = userData
  }

  /** 登出，清除会话中的 token */
  function logout() {
    token.value = ''
    user.value = null
    sessionStorage.removeItem(TOKEN_KEY)
  }

  return { token, user, isAuthenticated, setToken, setUser, logout }
})
