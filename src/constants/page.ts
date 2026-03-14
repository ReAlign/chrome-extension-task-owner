import {
  //
  CLS_STYLE_ACTIVE,
  ID_EDIT_CURRENT_TASK,
} from '@/constants/attrs'
import {
  //
  E_KEY_HOTKEY_DIALOG_HOTKEYS_OPEN,
  E_KEY_HOTKEY_DIALOG_SNIPPETS_OPEN,
  E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE,
} from '@/utils/event-bus'

export const PageModeMap = {
  NotInited: 'notInited',
  TaskMode: 'taskMode',
  DrawMode: 'drawMode',
  HideMode: 'hideMode',
} as const

export type T_PageMode = (typeof PageModeMap)[keyof typeof PageModeMap]

export type T_HotKeyEntry = {
  keys: string
  label: string
  description: string
  type: 'event_bus' | 'update_state'
  eventBusKey?: string
  stateKey?: T_PageMode
}

export const HotKeysMap: Record<string, T_HotKeyEntry> = {
  tips: {
    keys: 'meta+k',
    label: '⌘ + K',
    description: '查看快捷键提示',
    type: 'event_bus',
    eventBusKey: E_KEY_HOTKEY_DIALOG_HOTKEYS_OPEN,
  },
  task: {
    keys: 'meta+i',
    label: '⌘ + I',
    description: '激活/隐藏任务视图',
    type: 'update_state',
    stateKey: PageModeMap.TaskMode,
  },
  draw: {
    keys: 'meta+d',
    label: '⌘ + D',
    description: '激活/隐藏绘图视图',
    type: 'update_state',
    stateKey: PageModeMap.DrawMode,
  },
  // TODO - 要有前提，否则会生成空任务
  taskSave: {
    keys: 'meta+s',
    label: '⌘ + S',
    description: '聚焦编辑器右下角胶囊之后，保存当前任务',
    type: 'event_bus',
    eventBusKey: E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE,
  },
  snippets: {
    keys: 'meta+p',
    label: '⌘ + P',
    description: '打开代码片段对话框',
    type: 'event_bus',
    eventBusKey: E_KEY_HOTKEY_DIALOG_SNIPPETS_OPEN,
  },
}

/** 由 HotKeysMap 衍生的快捷键列表与 keys 查表，供单次 useHotkeys 使用，仅改 HotKeysMap 即可生效 */
export const HotKeysList = Object.values(HotKeysMap)
export const HotKeysKeysString = HotKeysList.map((e) => e.keys).join(',')
/** keys 字符串 -> 配置项，用于回调里根据 event 解析出的 keys 查表 */
export const HotKeysByKeys = new Map(HotKeysList.map((e) => [e.keys, e]))

const MODIFIER_KEYS = new Set(['meta', 'ctrl', 'control', 'alt', 'shift'])

/** 从 KeyboardEvent 生成与 HotKeysMap 中 keys 同格式的字符串，用于查 HotKeysByKeys */
export function getKeysStringFromKeyboardEvent(e: KeyboardEvent): string {
  const parts: string[] = []
  if (e.metaKey) parts.push('meta')
  if (e.ctrlKey) parts.push('ctrl')
  if (e.altKey) parts.push('alt')
  if (e.shiftKey) parts.push('shift')
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase()
  if (key && !MODIFIER_KEYS.has(key) && !parts.includes(key)) parts.push(key)
  return parts.join('+')
}

export const DropEndStateForCardNewStateMap: Record<
  Type_Dataset_DropZone,
  {
    cardTempState: Type_Dataset_DragCardTempState
    getEditorMode: (uniqueId: null | number) => Type_EditorMode
    handleDomAttrs: (dragEle: HTMLElement) => void
    handleWindowCurrentActiveTaskState: () => void
  }
> = {
  common: {
    cardTempState: 'common',
    getEditorMode: (uniqueId) => ({
      mode: 'add',
      uniqueId,
    }),
    handleDomAttrs: (dragEle) => {
      dragEle.removeAttribute('id')
      dragEle.classList.remove(CLS_STYLE_ACTIVE)
    },
    handleWindowCurrentActiveTaskState: () => {
      if (window.__current_active_task_original_state__) {
        window.__current_active_task_original_state__.stateNow = 'common'
      }
    },
  },
  edit: {
    cardTempState: 'editing',
    getEditorMode: (uniqueId) => ({
      mode: 'edit',
      uniqueId,
    }),
    handleDomAttrs: (dragEle) => {
      dragEle.setAttribute('id', ID_EDIT_CURRENT_TASK)
      dragEle.classList.add(CLS_STYLE_ACTIVE)
    },
    handleWindowCurrentActiveTaskState: () => {
      if (window.__current_active_task_original_state__) {
        window.__current_active_task_original_state__.stateNow = 'editing'
      }
    },
  },
  confirm: {
    cardTempState: 'confirmed',
    getEditorMode: (uniqueId) => ({
      mode: 'add',
      uniqueId,
    }),
    handleDomAttrs: (dragEle) => {
      dragEle.removeAttribute('id')
      dragEle.classList.remove(CLS_STYLE_ACTIVE)
    },
    handleWindowCurrentActiveTaskState: () => {
      if (window.__current_active_task_original_state__) {
        window.__current_active_task_original_state__.stateNow = 'confirmed'
      }
    },
  },
}
