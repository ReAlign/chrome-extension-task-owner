const INDEXED_DB_KEY = 'directory-handles-db'
const OBJECT_STORE_NAME = 'handles'
const HANDLE_NAME = 'my-directory'

type T_IndexedDBOpenRes = IDBDatabase | null

async function openDB(): Promise<T_IndexedDBOpenRes> {
  return new Promise((resolve) => {
    const request = indexedDB.open(INDEXED_DB_KEY, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        db.createObjectStore(OBJECT_STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => resolve(null)
  })
}

async function saveHandle(key: string, handle: FileSystemDirectoryHandle): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    if (db) {
      const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite')
      const store = tx.objectStore(OBJECT_STORE_NAME)
      const request = store.put(handle, key)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error(`保存句柄失败: ${request.error?.message}`))
    } else {
      reject(new Error('保存句柄失败'))
    }
  })
}

async function getHandle(key: string): Promise<FileSystemDirectoryHandle | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    if (db) {
      const tx = db.transaction(OBJECT_STORE_NAME, 'readonly')
      const store = tx.objectStore(OBJECT_STORE_NAME)
      const request = store.get(key)
      request.onsuccess = () => resolve((request.result as FileSystemDirectoryHandle) || null)
      request.onerror = () => reject(new Error(`获取句柄失败: ${request.error?.message}`))
    } else {
      reject(new Error('获取句柄失败'))
    }
  })
}

export const PickDirectoryRes = {
  CACHED: 'cached',
  NO_PERMISSION: 'no_permission',
  CANCELED: 'canceled',
  UNKNOWN: 'unknown',
} as const
export type T_Keys_PickDirectoryRes = keyof typeof PickDirectoryRes
export type T_PickDirectoryRes = (typeof PickDirectoryRes)[keyof typeof PickDirectoryRes]
export async function rePickDirectory(): Promise<T_PickDirectoryRes> {
  try {
    const dirHandle = await window.showDirectoryPicker?.()
    if (dirHandle) {
      const permission = await dirHandle?.requestPermission?.({ mode: 'readwrite' })
      if (permission === 'granted') {
        await saveHandle(HANDLE_NAME, dirHandle)
        console.log('目录已缓存')
        return PickDirectoryRes.CACHED
      } else {
        console.log('权限未授予')
        return PickDirectoryRes.NO_PERMISSION
      }
    } else {
      return PickDirectoryRes.UNKNOWN
    }
  } catch (e) {
    console.log('选择目录失败', e)
    return PickDirectoryRes.CANCELED
  }
}

export async function readCachedDirectory() {
  try {
    const dirHandle = await getHandle(HANDLE_NAME)
    if (!dirHandle) {
      console.log('没有缓存的目录句柄')
      return rePickDirectory()
    }
    const permission = await dirHandle.queryPermission?.({ mode: 'readwrite' })
    if (permission !== 'granted') {
      const newPerm = await dirHandle.requestPermission?.({ mode: 'readwrite' })
      if (newPerm !== 'granted') {
        console.log('没有访问权限')
        return
      }
    }
    // let entries = []
    // for await (const [name, handle] of dirHandle.entries()) {
    //   entries.push(`${handle.kind}: ${name}`)
    // }
    // output.textContent = '目录内容:\n' + entries.join('\n')
    console.log('读取目录成功:', dirHandle)
  } catch (e) {
    console.error('读取缓存目录失败:', e)
  }
}
