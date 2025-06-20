import {
  //
  getLocalData,
  insertLocalData,
  updateLocalData,
} from './_basic'

const LS_KEY_NT_TASKS = 'ls-key-nt-tasks'

export const apiQueryAllTasks = () =>
  // 读取数据
  getLocalData({ localKey: LS_KEY_NT_TASKS })

export const apiAddTask = (task: Type_TaskInfo) =>
  // 插入数据
  insertLocalData({ localKey: LS_KEY_NT_TASKS, taskItem: task })

export const apiUpdateTask = ({ createTimestamp, updateInfo }: Type_UpdateTaskProps) =>
  // 更新数据
  updateLocalData({ localKey: LS_KEY_NT_TASKS, createTimestamp, updateInfo })
