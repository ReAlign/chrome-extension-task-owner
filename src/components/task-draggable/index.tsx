import { useTaskDraggable } from '@/hooks/useTaskDraggable'

export const TaskDraggable = () => {
  useTaskDraggable()

  return (
    <div className="cls-new-tab-draggable-area-wrap">
      <div id="j-new-tab-draggable-area-real" className="cls-new-tab-draggable-area-inner">
        {/* insert cards node */}
        <div className="draggable drag-item markdown-body"> Draggable Element 1</div>
        <div className="draggable drag-item markdown-body"> Draggable Element 2</div>
      </div>
    </div>
  )
}
