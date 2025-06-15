import { useEffect } from 'react'
import { atom, useAtom } from 'jotai'

const jotaiTasks = atom<Type_TaskInfo[]>([])

export const useJotaiTasks = () => {
  const [tasks, setTasks] = useAtom(jotaiTasks)

  const initTasks = (initialTasks: Type_TaskInfo[]) => {
    setTasks(initialTasks)
  }

  const getTaskByUniqueId = (uniqueId: number): Type_TaskInfo | undefined => {
    return window.__global_tasks__.find((task) => task.createTimestamp === uniqueId)
  }

  const addTask = (task: Type_TaskInfo) => {
    setTasks((prevTasks) => [...prevTasks, task])
  }

  const updateTask = (uniqueId: number, { updateInfo }: Type_TaskUpdatePart) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        return task.createTimestamp === uniqueId
          ? {
              ...task,
              ...updateInfo,
            }
          : task
      })
    })
  }

  useEffect(() => {
    window.__global_tasks__ = tasks
  }, [tasks])

  return {
    tasks,
    initTasks,
    getTaskByUniqueId,
    addTask,
    updateTask,
  }
}
