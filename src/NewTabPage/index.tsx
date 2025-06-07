import { useHotkeys } from 'react-hotkeys-hook'

import { EditorVditor } from '@/components/editor-vditor'
import { TaskDraggable } from '@/components/task-draggable'

import './index.scss'

export const NewTabPage = () => {
  useHotkeys('meta+d', (evt) => {
    evt.preventDefault()

    alert('快捷键触发：meta+d')
  })

  return (
    <>
      <EditorVditor />
      <TaskDraggable />
    </>
  )
}
