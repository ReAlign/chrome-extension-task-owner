import { useEffect, useRef } from 'react'

import { HotKeysMap } from '@/constants'
import { DialogModal, T_DialogModalHandle } from '@/components/dialog'
import { EventBus, E_KEY_HOTKEY_DIALOG_HOTKEYS_OPEN } from '@/utils/event-bus'

import './index.scss'

export const DialogHotkeys = () => {
  const dialogRef = useRef<T_DialogModalHandle>(null)

  useEffect(() => {
    const handler = () => {
      dialogRef.current?.open()
    }

    EventBus.on(E_KEY_HOTKEY_DIALOG_HOTKEYS_OPEN, handler)
    return () => {
      EventBus.off(E_KEY_HOTKEY_DIALOG_HOTKEYS_OPEN, handler)
    }
  }, [])

  return (
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
  )
}
