import { useEffect, useRef } from 'react'
import Vditor from 'vditor'

import { ID_EDITOR_VDITOR } from '@/constants'

import {
  //
  EventBus,
  E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE,
  E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE_RESPONSE,
  E_KEY_GLOBAL_REQUEST_SET_EDITOR_VALUE,
} from '@/utils/event-bus'

import 'vditor/dist/index.css'
import 'vditor/dist/css/content-theme/dark.css'

import './index.scss'

export const ModuleEditorVditor = ({
  //
  classname,
}: {
  classname: string
}) => {
  const editorInstance = useRef<Vditor>(null)
  useEffect(() => {
    editorInstance.current = new Vditor(ID_EDITOR_VDITOR, {
      // 动态资源地址前缀
      cdn: 'libs/vditor',
      // 编辑器宽度
      width: '100%',
      // 编辑器高度
      height: '100%',
      // 防止丢失，本地缓存
      cache: {
        enable: false,
      },
      // 编辑器初始值
      // value: '',
      // 默认提示内容
      placeholder: '// TODO...',
      // 编辑器模式
      mode: 'ir',
      // 编辑器主题
      theme: 'dark',
      // 工具栏
      toolbar: [],
      toolbarConfig: {
        hide: true,
      },
      //
    })
  }, [])

  useEffect(() => {
    const metaSRequestVditorValueHandler = () => {
      if (editorInstance.current) {
        EventBus.emit(E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE_RESPONSE, {
          value: editorInstance.current.getValue(),
        })
      } else {
        alert('编辑器未初始化，请稍后再试！')
      }
    }
    const setEditorValueHandler = ({
      //
      value,
      fromScene,
    }: {
      value: string
      fromScene: 'edit' | 'reset'
    }) => {
      if (editorInstance.current) {
        editorInstance.current.setValue(value || '')
        if (fromScene === 'edit') {
          editorInstance.current.focus()
        }
      } else {
        alert('编辑器未初始化，请稍后再试！')
      }
    }
    EventBus.on(E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE, metaSRequestVditorValueHandler)
    EventBus.on(E_KEY_GLOBAL_REQUEST_SET_EDITOR_VALUE, setEditorValueHandler)
    return () => {
      EventBus.off(E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE, metaSRequestVditorValueHandler)
      EventBus.off(E_KEY_GLOBAL_REQUEST_SET_EDITOR_VALUE, setEditorValueHandler)
    }
  }, [])

  return (
    <div className={`${classname} bz-editor-vditor-container`}>
      <div id={ID_EDITOR_VDITOR} className="bz-editor-vditor-inner" />
    </div>
  )
}
