import {
  //
  useState,
  useEffect,
  useRef,
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  //
  T_PageMode,
  //
  PageModeMap,
  HotKeysMap,
} from '@/constants'
import { ModuleFullTask } from '@/components/module-full-task'
// import { ModuleFullDraw } from '@/components/module-full-draw'
import { DialogModal, T_DialogModalHandle } from '@/components/dialog'
import {
  //
  EventBus,
  E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE,
  E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE_RESPONSE,
  E_KEY_FROM_TOP_TO_DRAGGABLE_SAVE_VALUE,
} from '@/utils/event-bus'

import { generateNewTaskInfo } from './config'

import './index.scss'

export const NewTabPage = () => {
  const dialogRef = useRef<T_DialogModalHandle>(null)
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

  useHotkeys(HotKeysMap.task.keys, (evt) => {
    evt.preventDefault()
    updatePageModeState(PageModeMap.TaskMode)
  })
  useHotkeys(HotKeysMap.draw.keys, (evt) => {
    evt.preventDefault()
    updatePageModeState(PageModeMap.DrawMode)
  })

  useHotkeys(HotKeysMap.taskSave.keys, (evt) => {
    evt.preventDefault()
    EventBus.emit(E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE)
  })

  useHotkeys('meta+k', (evt) => {
    evt.preventDefault()
    dialogRef.current?.open()
  })

  useEffect(() => {
    const metaSRequestVditorValueResponseHandler = ({
      //
      value,
    }: {
      value: string
    }) => {
      console.log('Meta S - 当前内容:', { value, len: value.length })
      if (value.length) {
        EventBus.emit(E_KEY_FROM_TOP_TO_DRAGGABLE_SAVE_VALUE, {
          taskItem: generateNewTaskInfo({ value }),
        })
      }
    }

    EventBus.on(E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE_RESPONSE, metaSRequestVditorValueResponseHandler)
    return () => {
      EventBus.off(E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE_RESPONSE, metaSRequestVditorValueResponseHandler)
    }
  }, [])

  return (
    <>
      {pageModeState === PageModeMap.NotInited && <></>}
      {pageModeState === PageModeMap.TaskMode && <ModuleFullTask />}
      {/* {pageModeState === PageModeMap.DrawMode && <ModuleFullDraw />} */}
      <DialogModal ref={dialogRef}>
        <table className="bz-hotkeys-table">
          <colgroup>
            <col style={{ width: '40%' }} />
            <col style={{ width: '60%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>快捷键</th>
              <th>功能</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(HotKeysMap).map(([key, value]) => (
              <tr key={key}>
                <td>{value.label}</td>
                <td>{value.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogModal>
    </>
  )
}
