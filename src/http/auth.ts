import { post } from './common'
import { authApi } from './api'
import { encryptPassword } from '@/utils/crypto'

export interface LoginParams {
  username: string
  password: string
  time: number
}

export interface LoginResponse {
  token: string
  username: string
}

/**
 * 用户登录
 * 1. 取当前 Unix 秒级时间戳 time
 * 2. 计算 MD5(password + time)
 * 3. 将 username、md5 密文、time 提交后端
 *
 * 后端验证时容忍 ±10 秒时间偏移，对每个候选时间戳重新计算
 * MD5(storedPassword + candidateTime) 并与收到的密文比对。
 *
 * @param username 用户名
 * @param password 明文密码（发送前自动 MD5 加密）
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  const time = Math.floor(Date.now() / 10000)
  const encryptedPassword = encryptPassword(password, time)
  return await post(authApi.login(), {
    username,
    password: encryptedPassword,
    time,
  })
}
