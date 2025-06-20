import { useEffect } from 'react'

import {
  //
  apiQueryAllTasks,
  apiAddTask,
  apiUpdateTask,
} from '@/services'
import { useJotaiTasks } from '@/jotai'
import { useTaskDraggable } from '@/hooks/useTaskDraggable'
import { UnitTaskCard } from '@/components/unit-task-card'
import {
  //
  EventBus,
  E_KEY_FROM_TOP_TO_DRAGGABLE_SAVE_VALUE,
  E_KEY_FROM_DRAG_HOOK_TO_DRAGGABLE_UPDATE_VALUE,
  E_KEY_GLOBAL_REQUEST_SET_EDITOR_VALUE,
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
  const {
    //
    tasks,
    initTasks,
    addTask,
    updateTask,
  } = useJotaiTasks()

  useEffect(() => {
    apiQueryAllTasks()
      .then((res) => {
        logger('queryAllTasks - 查询到的任务列表:', res)
        if (res.success) {
          initTasks(res.data || [])
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
      apiAddTask(taskItem)
        .then((result) => {
          if (result) {
            EventBus.emit(E_KEY_GLOBAL_REQUEST_SET_EDITOR_VALUE, {
              fromScene: 'reset',
              value: '',
            })
            addTask(taskItem)
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
      apiUpdateTask({ createTimestamp, updateInfo })
        .then((result) => {
          if (result) {
            if (scene === 'status' && (updateInfo as Type_TaskInfo_Status)?.status) {
              updateTask(createTimestamp, { updateInfo })
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
        {tasks.map((taskItem) => {
          return <UnitTaskCard key={taskItem.createTimestamp} taskInfo={taskItem} />
        })}
      </div>
    </div>
  )
}
