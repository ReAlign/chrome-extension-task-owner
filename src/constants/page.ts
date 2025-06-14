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
