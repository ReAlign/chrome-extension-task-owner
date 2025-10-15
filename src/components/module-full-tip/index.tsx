import { useEffect } from 'react'
import Shinejs from 'shine.js'

import { APP_NAME, HotKeysMap } from '@/constants'

import './index.scss'

const J_ID_SHINE = 'j-id-shine'

export const ModuleFullTip = () => {
  useEffect(() => {
    const shine = new Shinejs.Shine(document.getElementById(J_ID_SHINE))

    function handleMouseMove(event: MouseEvent) {
      shine.light.position.x = event.clientX
      shine.light.position.y = event.clientY
      shine.draw()
    }

    window.addEventListener('mousemove', handleMouseMove, false)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove, false)
    }
  }, [])
  return (
    <div className="bz-tip-container">
      <div id={J_ID_SHINE} className="bz-tip-title">
        {APP_NAME}
      </div>
      <div className="bz-tip-txt">{HotKeysMap.tips.label}</div>
    </div>
  )
}
