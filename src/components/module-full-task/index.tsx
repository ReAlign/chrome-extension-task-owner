import { ModuleEditorVditor } from '@/components/module-task-editor'
import { ModuleEditButtons } from '@/components/module-task-edit-buttons'
import { ModuleTaskDropArea } from '@/components/module-task-drop-area'
import { ModuleTaskDraggable } from '@/components/module-task-draggable'

import './index.scss'

export const EditorVditorWidth = 500

export const ModuleFullTask = () => {
  return (
    <>
      <ModuleEditorVditor classname="bz-task-editor" />
      <ModuleEditButtons classname="bz-task-edit-buttons" />
      {/*  */}
      <ModuleTaskDraggable classname="bz-task-draggable" />
      <ModuleTaskDropArea classname="bz-task-drop-area" />
    </>
  )
}
