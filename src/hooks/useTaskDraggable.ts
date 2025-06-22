import { useEffect, MouseEvent } from 'react'
import interact from 'interactjs'

import {
  //
  CLS_DROP_ZONE,
  CLS_DROPPABLE_HANDLE,
  CLS_DRAGGABLE_HANDLE,
  DatasetKeyDropZoneType,
  DatasetKeyDropZoneHighlightClass,
  DatasetKeyDragCardUniqueId,
  DatasetKeyDragCardStatus,
  DropEndStateForCardNewStateMap,
  CLS_STYLE_EDIT_DONE,
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
  updateFromScene,
  dragMovingHandler,
}: {
  isMoving: boolean
  updateFromScene: 'start' | 'move' | 'end'
  dragMovingHandler: any
}) => {
  logger('updateDragMovingState - 移动状态更新', isMoving, updateFromScene)
  dragMovingHandler(isMoving)
}

export const useTaskDraggable = () => {
  const { setDragMoving } = useJotaiDraggable()
  const { setEditorMode } = useJotaiEditorMode()
  const { getTaskByUniqueId } = useJotaiTasks()

  useEffect(() => {
    // 监听拖动
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
        start: (evt: MouseEvent<HTMLLIElement>) => {
          console.log('拖拽开始:', evt)
          updateDragMovingState({
            //
            isMoving: true,
            updateFromScene: 'start',
            dragMovingHandler: setDragMoving,
          })
          const draggableEle = evt.target as HTMLElement
          if (draggableEle) {
            const uniqueId = Number(draggableEle.getAttribute(DatasetKeyDragCardUniqueId))
            const stateBeforeDrag = draggableEle.getAttribute(
              DatasetKeyDragCardStatus,
            ) as Type_Dataset_DragCardTempState

            console.log('拖拽开始 - 任务唯一ID:', uniqueId, stateBeforeDrag)

            window.__current_active_task_original_state__ = {
              uniqueId,
              stateBeforeDrag,
              stateNow: stateBeforeDrag,
            }
          }
        },
        move: (evt: MouseEvent<HTMLLIElement>) => {
          updateDragMovingState({
            //
            isMoving: true,
            updateFromScene: 'move',
            dragMovingHandler: setDragMoving,
          })
          const draggableEle = evt.target as HTMLElement
          if (draggableEle) {
            const x = Number((parseFloat(`${draggableEle.getAttribute('data-x')}`) || 0) + (evt as any).dx)
            const y = Number((parseFloat(`${draggableEle.getAttribute('data-y')}`) || 0) + (evt as any).dy)

            draggableEle.style.transform = `translate(${x}px, ${y}px)`
            draggableEle.setAttribute('data-x', `${x}`)
            draggableEle.setAttribute('data-y', `${y}`)
          }
        },
        end: (evt: MouseEvent<HTMLLIElement>) => {
          updateDragMovingState({
            isMoving: false,
            updateFromScene: 'end',
            dragMovingHandler: setDragMoving,
          })
          const draggableEle = evt.target as HTMLElement
          if (draggableEle) {
            const uniqueId = draggableEle.getAttribute(DatasetKeyDragCardUniqueId)
            const state = draggableEle.getAttribute(DatasetKeyDragCardStatus) as Type_Dataset_DragCardTempState
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
      },
    })
    // 监听放置
    interact(`.${CLS_DROP_ZONE}`).dropzone({
      // only accept elements matching this CSS selector
      accept: `.${CLS_DROPPABLE_HANDLE}`,
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.75,

      // listen for drop related events:

      // // 拖拽开始
      // ondropactivate: function (event) {
      //   // add active dropzone feedback
      //   const dropzoneEle = event.target
      //   const draggableEle = event.relatedTarget

      //   console.log('拖拽开始: ', {
      //     //
      //     dropzoneEle,
      //     draggableEle,
      //   })
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
        const dropzoneEle = event.target as HTMLElement
        const draggableEle = event.relatedTarget as HTMLElement

        const action = dropzoneEle.getAttribute(DatasetKeyDropZoneType) as Type_Dataset_DropZone
        const uniqueId = Number(draggableEle.getAttribute(DatasetKeyDragCardUniqueId))

        const {
          //
          cardTempState,
          getEditorMode,
          handleDomAttrs,
          handleWindowCurrentActiveTaskState,
        } = DropEndStateForCardNewStateMap[action]

        // Common handle
        draggableEle.setAttribute(DatasetKeyDragCardStatus, cardTempState)
        setEditorMode(getEditorMode(action === 'edit' ? uniqueId : null))
        handleDomAttrs(draggableEle)
        handleWindowCurrentActiveTaskState()

        // Conditional handle
        if (action === 'common') {
          if (window.__current_active_task_original_state__?.stateBeforeDrag === 'editing') {
            draggableEle.classList.remove(CLS_STYLE_EDIT_DONE)
            EventBus.emit(E_KEY_GLOBAL_REQUEST_SET_EDITOR_VALUE, {
              fromScene: 'edit-cancel',
              value: '',
            })
          }
        } else if (action === 'confirm') {
          const updateProps: Type_EB_UpdateTaskProps = {
            scene: 'status',
            createTimestamp: uniqueId,
            updateInfo: {
              status: 'confirmed',
            },
          }
          EventBus.emit(E_KEY_FROM_DRAG_HOOK_TO_DRAGGABLE_UPDATE_VALUE, updateProps)
        } else if (action === 'edit') {
          const content = getTaskByUniqueId(uniqueId)?.content || ''
          EventBus.emit(E_KEY_GLOBAL_REQUEST_SET_EDITOR_VALUE, {
            fromScene: 'edit',
            value: content,
          })
        }
      },
      // // 拖拽结束
      // ondropdeactivate: function (_event) {
      //   // remove active dropzone feedback
      //   // event.target.classList.remove('drop-active')
      //   // event.target.classList.remove('drop-target')
      // },
    })
  }, [])
}
