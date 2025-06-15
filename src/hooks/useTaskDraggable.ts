import { useEffect, MouseEvent } from 'react'
import interact from 'interactjs'

import {
  //
  CLS_DROP_ZONE,
  CLS_DROPPABLE_HANDLE,
  CLS_DRAGGABLE_HANDLE,
  ID_EDIT_CURRENT_TASK,
  CLS_STYLE_ACTIVE,
  DatasetKeyDropZoneType,
  DatasetKeyDropZoneHighlightClass,
  DatasetKeyDragCardUniqueId,
  DatasetKeyDragCardStatus,
} from '@/constants'
import { EditorVditorWidth } from '@/components/module-full-task'
import {
  //
  EventBus,
  E_KEY_FROM_DRAG_HOOK_TO_DRAGGABLE_UPDATE_VALUE,
  E_KEY_GLOBAL_REQUEST_SET_EDITOR_VALUE,
} from '@/utils/event-bus'
import { logger } from '@/utils/logger'
// import { showToast } from '@/utils/toast'

import {
  //
  useJotaiDraggable,
  useJotaiEditorMode,
  useJotaiTasks,
} from '@/jotai'

const updateDragMovingState = ({
  //
  isMoving,
  fromX,
  dragMovingHandler,
}: {
  isMoving: boolean
  fromX: string
  dragMovingHandler: any
}) => {
  logger('updateDragMovingState - 移动状态更新', isMoving, fromX)
  dragMovingHandler(isMoving)
}

const listeners = {
  dragMoveListener: function ({
    //
    evt,
    dragMovingHandler,
  }: {
    evt: MouseEvent<HTMLLIElement>
    dragMovingHandler: any
  }) {
    updateDragMovingState({ isMoving: true, fromX: 'move', dragMovingHandler })
    const target = evt.target as HTMLElement
    if (target) {
      const x = Number((parseFloat(`${target.getAttribute('data-x')}`) || 0) + (evt as any).dx)
      const y = Number((parseFloat(`${target.getAttribute('data-y')}`) || 0) + (evt as any).dy)

      target.style.transform = `translate(${x}px, ${y}px)`
      target.setAttribute('data-x', `${x}`)
      target.setAttribute('data-y', `${y}`)
    }
  },
  dragEndListener: function ({
    //
    evt,
    dragMovingHandler,
  }: {
    evt: MouseEvent<HTMLLIElement>
    dragMovingHandler: any
  }) {
    updateDragMovingState({
      isMoving: false,
      fromX: 'end',
      dragMovingHandler,
    })
    dragMovingHandler(false)
    const target = evt.target as HTMLElement
    if (target) {
      const uniqueId = target.getAttribute(DatasetKeyDragCardUniqueId)
      const state = target.getAttribute(DatasetKeyDragCardStatus)
      const { top, left } = (evt as any).rect
      const dragAreaPadding = 24

      const x = Math.floor(left - EditorVditorWidth - dragAreaPadding)
      const y = Math.floor(top - dragAreaPadding)

      console.log('拖拽结束:', {
        //
        uniqueId,
        state,
        x,
        y,
      })
      if (state !== 'confirmed' && uniqueId) {
        const updateProps: Type_EB_UpdateTaskProps = {
          scene: 'position',
          createTimestamp: Number(uniqueId),
          updateInfo: {
            positionX: x,
            positionY: y,
          },
        }
        EventBus.emit(E_KEY_FROM_DRAG_HOOK_TO_DRAGGABLE_UPDATE_VALUE, updateProps)
      }
    }
  },
}

export const useTaskDraggable = () => {
  const { setDragMoving } = useJotaiDraggable()
  const { setEditorMode } = useJotaiEditorMode()
  const { getTaskByUniqueId } = useJotaiTasks()

  useEffect(() => {
    interact(`.${CLS_DROP_ZONE}`).dropzone({
      // only accept elements matching this CSS selector
      accept: `.${CLS_DROPPABLE_HANDLE}`,
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.75,

      // listen for drop related events:

      // // 拖拽开始
      // ondropactivate: function (_event) {
      //   // add active dropzone feedback
      // },
      // 拖拽进入
      ondragenter: function (event) {
        const dropZoneEle = event.target

        const cls = dropZoneEle.getAttribute(DatasetKeyDropZoneHighlightClass)
        if (cls) {
          dropZoneEle.classList.add(cls)
        }
      },
      // 拖拽离开
      ondragleave: function (event) {
        const dropZoneEle = event.target

        const cls = dropZoneEle.getAttribute(DatasetKeyDropZoneHighlightClass)
        if (cls) {
          dropZoneEle.classList.remove(cls)
        }
      },
      // 拖拽放下
      ondrop: function (event) {
        const dropzoneEle = event.target
        const draggableEle = event.relatedTarget

        const action: Type_Dataset_DropZone = dropzoneEle.getAttribute(DatasetKeyDropZoneType)
        const targetTaskUniqueId = draggableEle.getAttribute(DatasetKeyDragCardUniqueId)
        const uniqueId = Number(targetTaskUniqueId)

        logger('拖拽放下:', {
          //
          action,
          targetTaskUniqueId,
        })

        if (action === 'common') {
          setEditorMode({ mode: 'add', uniqueId: null })
          draggableEle.removeAttribute('id')
          draggableEle.classList.remove(CLS_STYLE_ACTIVE)
        } else if (action === 'confirm') {
          const newCardStatus: Type_Dataset_DragCardTempState = 'confirmed'
          draggableEle.setAttribute(DatasetKeyDragCardStatus, newCardStatus)
          const updateProps: Type_EB_UpdateTaskProps = {
            scene: 'status',
            createTimestamp: uniqueId,
            updateInfo: {
              status: 'confirmed',
            },
          }
          EventBus.emit(E_KEY_FROM_DRAG_HOOK_TO_DRAGGABLE_UPDATE_VALUE, updateProps)
        } else if (action === 'edit') {
          setEditorMode({ mode: 'edit', uniqueId })
          const content = getTaskByUniqueId(uniqueId)?.content || ''
          draggableEle.setAttribute('id', ID_EDIT_CURRENT_TASK)
          draggableEle.classList.add(CLS_STYLE_ACTIVE)
          EventBus.emit(E_KEY_GLOBAL_REQUEST_SET_EDITOR_VALUE, {
            fromScene: 'edit',
            value: content,
          })
          // showToast({ text: '编辑暂不支持' })
        }
      },
      // // 拖拽结束
      // ondropdeactivate: function (_event) {
      //   // remove active dropzone feedback
      //   // event.target.classList.remove('drop-active')
      //   // event.target.classList.remove('drop-target')
      // },
    })

    interact(`.${CLS_DRAGGABLE_HANDLE}`).draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true,
        }),
      ],
      autoScroll: true,

      listeners: {
        move: (evt: MouseEvent<HTMLLIElement>) => {
          listeners.dragMoveListener({ evt, dragMovingHandler: setDragMoving })
        },
        end: (evt: MouseEvent<HTMLLIElement>) => {
          listeners.dragEndListener({ evt, dragMovingHandler: setDragMoving })
        },
      },
    })
  }, [])
}
