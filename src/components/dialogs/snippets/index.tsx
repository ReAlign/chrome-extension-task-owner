import { useEffect, useRef } from 'react'

import { DialogModal, T_DialogModalHandle } from '@/components/dialog'
import { EventBus, E_KEY_HOTKEY_DIALOG_SNIPPETS_OPEN } from '@/utils/event-bus'

import { rePickDirectory, readCachedDirectory } from './helper'

import './index.scss'

export const DialogSnippets = () => {
  const dialogRef = useRef<T_DialogModalHandle>(null)

  useEffect(() => {
    const handler = () => {
      dialogRef.current?.open()
    }

    EventBus.on(E_KEY_HOTKEY_DIALOG_SNIPPETS_OPEN, handler)
    return () => {
      EventBus.off(E_KEY_HOTKEY_DIALOG_SNIPPETS_OPEN, handler)
    }
  }, [])

  return (
    <DialogModal ref={dialogRef}>
      <div>
        <button
          onClick={() => {
            void rePickDirectory()
          }}
        >
          open-1
        </button>
        <button
          onClick={() => {
            void readCachedDirectory()
          }}
        >
          open-2
        </button>
      </div>
    </DialogModal>
  )
}
