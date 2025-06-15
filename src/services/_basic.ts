import { logger } from '@/utils/logger'

import { safeParse, safeStringify } from './_helper'

type T_GetLocalDataParams = {
  localKey: string
}
export const getLocalData = ({
  //
  localKey,
}: T_GetLocalDataParams): Promise<{
  success: boolean
  data: Type_TaskInfo[] | null
}> => {
  // 读取数据
  return new Promise((resolve, _reject) => {
    chrome.storage.local.get(localKey, function (result) {
      // logger('读取到的数据 ->', result[localKey])
      const data = safeParse(`${result[localKey]}`)
      if (result[localKey] !== undefined && data === null) {
        logger('error: 数据解析失败或不存在')

        resolve({
          success: false,
          data: null,
        })
      } else {
        if (chrome.runtime.lastError) {
          logger(chrome.runtime.lastError)

          resolve({
            success: false,
            data: null,
          })
        } else {
          resolve({
            success: true,
            data: data as Type_TaskInfo[],
          })
        }
      }
    })
  })
}

type T_SetLocalDataParams = T_GetLocalDataParams & {
  tasks: Type_TaskInfo[]
}
const setLocalData = ({
  //
  localKey,
  tasks,
}: T_SetLocalDataParams): Promise<{
  success: boolean
  message: string
}> => {
  // 设置数据
  return new Promise((resolve, _reject) => {
    const newData = safeStringify(tasks)
    if (newData === null) {
      logger('数据不能为空或无效')
      resolve({
        success: false,
        message: '数据不能为空或无效',
      })
    } else {
      chrome.storage.local.set({ [localKey]: newData }, function () {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError)
          resolve({
            success: false,
            message: chrome.runtime.lastError.message || '未知错误',
          })
        } else {
          console.log('数据已保存')
          resolve({
            success: true,
            message: '',
          })
        }
      })
    }
  })
}

const getOriData4Action = async ({
  //
  localKey,
}: T_GetLocalDataParams): Promise<false | Type_TaskInfo[]> => {
  const { success, data } = await getLocalData({ localKey })
  console.log('xx 查询到的数据:', success, data)
  return success
    ? //
      data === null
      ? []
      : data
    : false
}

type T_InsertLocalDataParams = T_GetLocalDataParams & {
  taskItem: Type_TaskInfo
}
export const insertLocalData = async ({
  //
  localKey,
  taskItem,
}: T_InsertLocalDataParams): Promise<boolean> => {
  let flag = false

  const oriData = await getOriData4Action({ localKey })

  if (oriData) {
    oriData.push(taskItem)
    const res = await setLocalData({
      localKey,
      tasks: oriData,
    })
    flag = res.success
  }

  return flag
}

type T_UpdateLocalDataParams = T_GetLocalDataParams & Type_UpdateTaskProps

export const updateLocalData = async ({
  //
  localKey,
  createTimestamp,
  updateInfo,
}: T_UpdateLocalDataParams): Promise<boolean> => {
  let flag = false

  const oriData = await getOriData4Action({ localKey })
  if (oriData) {
    const targetDataIndex = oriData.findIndex(
      //
      (item) => item.createTimestamp === createTimestamp,
    )

    if (targetDataIndex !== -1) {
      oriData[targetDataIndex] = {
        ...oriData[targetDataIndex],
        ...updateInfo,
      }
      const res = await setLocalData({
        localKey,
        tasks: oriData,
      })
      flag = res.success
    }
  }

  return flag
}
