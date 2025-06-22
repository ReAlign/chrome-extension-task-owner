import {
  //
  CLS_STYLE_ACTIVE,
  ID_EDIT_CURRENT_TASK,
} from '@/constants'

export const HotKeysMap = {
  task: {
    keys: 'meta+i',
    label: '⌘ + I',
    description: '激活/隐藏任务视图',
  },
  taskSave: {
    keys: 'meta+s',
    label: '⌘ + S',
    description: '聚焦编辑器右下角胶囊之后，保存当前任务',
  },
  //
  draw: {
    keys: 'meta+d',
    label: '⌘ + D',
    description: '激活/隐藏绘图视图',
  },
}

export const PageModeMap = {
  NotInited: 'notInited',
  TaskMode: 'taskMode',
  DrawMode: 'drawMode',
  HideMode: 'hideMode',
} as const

export type T_PageMode = (typeof PageModeMap)[keyof typeof PageModeMap]

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
