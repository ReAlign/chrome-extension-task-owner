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

export const HotKeysMap: Record<
  string,
  {
    keys: string
    label: string
    description: string
    type: 'event_bus' | 'update_state'
    eventBusKey?: string
    stateKey?: T_PageMode
  }
> = {
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
