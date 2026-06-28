import type { Params } from '@/types/common'

const TOKEN_KEY = 'auth_token'

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const token = sessionStorage.getItem(TOKEN_KEY)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export async function get (path: string, params?: Params) {
  let url = path
  if (params) {
    url += '?' + new URLSearchParams(params).toString()
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data
}

export async function post (path: string, data?: any) {
  let url = path
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const _data = await response.json()
  return _data
}


export async function put(path: string, data?: any) {
  let url = path
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const _data = await response.json()
  return _data
}

export async function patch(path: string, data?: any) {
  let url = path
  const response = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const _data = await response.json()
  return _data
}

export async function del(path: string) {
  let url = path
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const _data = await response.json()
  return _data
}