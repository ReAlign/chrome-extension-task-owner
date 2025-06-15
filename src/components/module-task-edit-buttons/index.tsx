import { useState } from 'react'

import { useJotaiEditorMode } from '@/jotai'

import './index.scss'

export const ModuleEditButtons = ({
  //
  classname,
}: {
  classname: string
}) => {
  const { editorMode } = useJotaiEditorMode()
  // '✔︎' | '✘'
  const [saveState, setSaveState] = useState<
    { stat: 'wait-save'; label: '⌛️' } | { stat: 'can-not-save'; label: '🚫' }
  >({ stat: 'can-not-save', label: '🚫' })
  return (
    <div
      //
      tabIndex={0}
      className={`${classname} bz-edit-buttons-container`}
      onFocus={() => {
        setSaveState({ stat: 'wait-save', label: '⌛️' })
      }}
      onBlur={() => {
        setSaveState({ stat: 'can-not-save', label: '🚫' })
      }}
    >
      {editorMode.mode} {saveState.label}
    </div>
  )
}
