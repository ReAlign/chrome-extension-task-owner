/// <reference types="vite/client" />

declare interface Window {
  __global_tasks__: Type_TaskInfo[] // 全局任务列表
}

type Type_TaskInfo_Unique = {
  createTimestamp: number // 用于唯一标识任务卡片
}
type Type_TaskInfo_Content = {
  latestUpdateTimestamp: number // 任务卡片的最新更新时间戳
  content: string // 任务卡片内容
}
type Type_TaskInfo_Position = {
  positionX: number // 任务卡片在容器中的位置，0-1之间的值
  positionY: number // 任务卡片在容器中的位置，0-1之间的值
}
type Type_TaskInfo_Status = {
  status: 'normal' | 'confirmed' // 任务卡片状态，normal: 正常，confirmed: 已确认
}
type Type_TaskInfo = Type_TaskInfo_Unique &
  Type_TaskInfo_Content &
  Type_TaskInfo_Position &
  Type_TaskInfo_Status & {
    contentRotate: number // 任务卡片内容的旋转角度，单位为度
  }
type Type_TaskUpdatePart = {
  updateInfo: Type_TaskInfo_Content | Type_TaskInfo_Position | Type_TaskInfo_Status
}
type Type_UpdateTaskProps = Type_TaskInfo_Unique & Type_TaskUpdatePart

type Type_EB_UpdateTaskProps = Type_UpdateTaskProps & {
  scene: 'position' | 'content' | 'status'
}

/**
 * dataset define
 */
type Type_Dataset_DropZone = 'common' | 'edit' | 'confirm'
type Type_Dataset_DragCardTempState = 'confirmed'
