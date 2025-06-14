import { Excalidraw } from '@excalidraw/excalidraw'

import '@excalidraw/excalidraw/index.css'

import './index.scss'

export const ModuleFullDraw = () => {
  return (
    <div className="bz-draw-container">
      <Excalidraw
        //
        theme="dark"
        langCode="zh-CN"
      />
    </div>
  )
}
