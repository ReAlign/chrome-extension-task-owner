import {
  //
  useState,
  useEffect,
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { T_PageMode, PageModeMap, HotKeysKeysString, HotKeysByKeys, getKeysStringFromKeyboardEvent } from '@/constants'
import { ModuleFullTip } from '@/components/module-full-tip'
import { ModuleFullTask } from '@/components/module-full-task'
import { ModuleFullDraw } from '@/components/module-full-draw'
import { DialogHotkeys, DialogSnippets } from '@/components/dialogs'
import {
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

  // 单次 useHotkeys 注册 HotKeysMap 中全部快捷键，符合 Hooks 规则；后续只改 HotKeysMap 即可生效
  useHotkeys(
    HotKeysKeysString,
    (evt) => {
      evt.preventDefault()
      // 从组合按键事件中获取对应的快捷键配置项
      const entry = HotKeysByKeys.get(getKeysStringFromKeyboardEvent(evt))

      if (!entry) return

      if (entry.type === 'update_state' && entry.stateKey) {
        updatePageModeState(entry.stateKey)
      } else if (entry.type === 'event_bus' && entry.eventBusKey) {
        EventBus.emit(entry.eventBusKey)
      }
    },
    { preventDefault: true },
    [updatePageModeState],
  )

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
      {(pageModeState === PageModeMap.NotInited || pageModeState === PageModeMap.HideMode) && <ModuleFullTip />}
      {pageModeState === PageModeMap.TaskMode && <ModuleFullTask />}
      {pageModeState === PageModeMap.DrawMode && <ModuleFullDraw />}
      <DialogHotkeys />
      <DialogSnippets />
    </>
  )
}
