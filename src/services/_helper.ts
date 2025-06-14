import { logger } from '@/utils/logger'

export const safeStringify = (obj: unknown) => {
  if (obj === '' || obj === null || obj === undefined) {
    return null
  } else {
    return JSON.stringify(obj)
  }
}
export const safeParse = (str: string) => {
  let parsed: unknown = null
  try {
    parsed = JSON.parse(str)
  } catch (e) {
    logger('JSON 解析错误 ->', e)
  }

  return parsed
}
