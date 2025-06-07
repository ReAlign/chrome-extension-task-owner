import { useEffect, useRef } from 'react'
import Vditor from 'vditor'

// import '~vditor/src/assets/less/index'

export const EditorVditor = () => {
  const editorInstance = useRef<Vditor>(null)
  useEffect(() => {
    editorInstance.current = new Vditor('j-new-tab-editor', {
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
  return (
    <div className="cls-new-tab-editor">
      <div id="j-new-tab-editor" className="cls-new-tab-editor-inner">
        {/* insert vditor node */}
      </div>
    </div>
  )
}
