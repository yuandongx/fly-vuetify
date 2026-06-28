import CryptoJS from 'crypto-js'

/**
 * 对密码 + 时间戳 进行 MD5 运算
 * @param password 明文密码
 * @param timestamp 当前 Unix 时间戳（秒）
 * @returns MD5 哈希字符串
 */
export function encryptPassword(password: string, timestamp: number): string {
  const raw = `${password}+${timestamp}`
  return CryptoJS.MD5(raw).toString()
}
