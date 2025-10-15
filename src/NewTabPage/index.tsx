import {
  //
  useState,
  useEffect,
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  //
  T_PageMode,
  //
  PageModeMap,
  HotKeysMap,
} from '@/constants'
import { ModuleFullTip } from '@/components/module-full-tip'
import { ModuleFullTask } from '@/components/module-full-task'
import { ModuleFullDraw } from '@/components/module-full-draw'
import { DialogHotkeys, DialogSnippets } from '@/components/dialogs'
import {
  //
  EventBus,
  E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE_RESPONSE,
  E_KEY_FROM_TOP_TO_DRAGGABLE_SAVE_NEW_VALUE,
  E_KEY_FROM_TOP_TO_DRAGGABLE_SAVE_OLD_VALUE,
} from '@/utils/event-bus'
import { logger } from '@/utils/logger'

import { generateNewTaskInfo } from './config'

import './index.scss'

export const NewTabPage = () => {
  window.__global_tasks__ = []
  window.__current_active_task_original_state__ = null

  const [
    //
    pageModeState,
    setPageModeState,
  ] = useState<T_PageMode>(PageModeMap.NotInited)

  const updatePageModeState = (targetPageMode: T_PageMode) => {
    if (pageModeState === PageModeMap.NotInited) {
      setPageModeState(targetPageMode)
    } else {
      setPageModeState(
        //
        pageModeState === targetPageMode
          ? //
            PageModeMap.HideMode
          : targetPageMode,
      )
    }
  }

  Object.values(HotKeysMap).forEach(({ keys, type, stateKey, eventBusKey }) => {
    useHotkeys(keys, (evt) => {
      evt.preventDefault()

      if (type === 'update_state' && stateKey) {
        updatePageModeState(stateKey)
      } else if (type === 'event_bus' && eventBusKey) {
        EventBus.emit(eventBusKey)
      } else {
        //
      }
    })
  })

  useEffect(() => {
    const metaSRequestVditorValueResponseHandler = ({
      //
      value,
    }: {
      value: string
    }) => {
      logger('Meta S - 当前内容:', {
        //
        value,
        len: value.length,
        xxx: window.__current_active_task_original_state__?.stateNow,
      })
      if (value.length) {
        const {
          //
          uniqueId,
          stateNow,
        } = window.__current_active_task_original_state__ || {}

        if (stateNow === 'editing' && uniqueId) {
          // 编辑
          const updateProps: Type_EB_UpdateTaskProps = {
            scene: 'content',
            createTimestamp: uniqueId,
            updateInfo: {
              latestUpdateTimestamp: Date.now(),
              content: value,
            },
          }
          EventBus.emit(E_KEY_FROM_TOP_TO_DRAGGABLE_SAVE_OLD_VALUE, updateProps)
        } else {
          // 新建
          EventBus.emit(E_KEY_FROM_TOP_TO_DRAGGABLE_SAVE_NEW_VALUE, {
            taskItem: generateNewTaskInfo({ value }),
          })
        }
      }
    }

    EventBus.on(E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE_RESPONSE, metaSRequestVditorValueResponseHandler)
    return () => {
      EventBus.off(E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE_RESPONSE, metaSRequestVditorValueResponseHandler)
    }
  }, [])

  return (
    <>
      {pageModeState === PageModeMap.NotInited && <ModuleFullTip />}
      {pageModeState === PageModeMap.TaskMode && <ModuleFullTask />}
      {pageModeState === PageModeMap.DrawMode && <ModuleFullDraw />}
      <DialogHotkeys />
      <DialogSnippets />
    </>
  )
}
