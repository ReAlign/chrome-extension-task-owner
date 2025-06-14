import { useState, useEffect } from 'react'

import {
  //
  queryAllTasks,
  addTask,
  updateTask,
} from '@/services'
import { useTaskDraggable } from '@/hooks/useTaskDraggable'
import { UnitTaskCard } from '@/components/unit-task-card'
import {
  //
  EventBus,
  E_KEY_FROM_TOP_TO_DRAGGABLE_SAVE_VALUE,
  E_KEY_FROM_DRAG_HOOK_TO_DRAGGABLE_UPDATE_VALUE,
} from '@/utils/event-bus'
import { logger } from '@/utils/logger'

import './index.scss'

export const ModuleTaskDraggable = ({
  //
  classname,
}: {
  classname: string
}) => {
  useTaskDraggable()

  const [
    //
    taskList,
    setTaskList,
  ] = useState<Type_TaskInfo[]>([])

  useEffect(() => {
    queryAllTasks()
      .then((res) => {
        logger('查询到的任务列表:', res)
        if (res.success) {
          setTaskList(res.data || [])
        }
      })
      .catch((_err) => {})

    const handleSaveValue = ({
      //
      taskItem,
    }: {
      taskItem: Type_TaskInfo
    }) => {
      logger('接收到新建任务卡片:', taskItem)
      addTask(taskItem)
        .then((result) => {
          if (result) {
            setTaskList((prev) => [...prev, taskItem])
          }
        })
        .catch((_err) => {})
    }
    const handleUpdateValue = ({
      //
      scene,
      createTimestamp,
      updateInfo,
    }: Type_EB_UpdateTaskProps) => {
      logger('接收到更新任务卡片:', { scene, createTimestamp, updateInfo })
      updateTask({ createTimestamp, updateInfo })
        .then((result) => {
          if (result) {
            if (scene === 'status' && (updateInfo as Type_TaskInfo_Status)?.status) {
              setTaskList((prev) => {
                return prev.map((taskItem) => {
                  return {
                    ...taskItem,
                    ...(taskItem.createTimestamp === createTimestamp
                      ? { status: (updateInfo as Type_TaskInfo_Status).status }
                      : {}),
                  }
                })
              })
            }
          } else {
            logger('更新任务卡片失败，请稍后重试')
          }
        })
        .catch((_err) => {})
    }

    EventBus.on(E_KEY_FROM_TOP_TO_DRAGGABLE_SAVE_VALUE, handleSaveValue)
    EventBus.on(E_KEY_FROM_DRAG_HOOK_TO_DRAGGABLE_UPDATE_VALUE, handleUpdateValue)

    return () => {
      EventBus.off(E_KEY_FROM_TOP_TO_DRAGGABLE_SAVE_VALUE, handleSaveValue)
      EventBus.off(E_KEY_FROM_DRAG_HOOK_TO_DRAGGABLE_UPDATE_VALUE, handleUpdateValue)
    }
  }, [])

  return (
    <div className={`${classname} bz-task-draggable-container`}>
      <div className="bz-task-draggable-inner">
        {taskList.map((taskItem) => {
          return <UnitTaskCard key={taskItem.createTimestamp} taskInfo={taskItem} />
        })}
      </div>
    </div>
  )
}
