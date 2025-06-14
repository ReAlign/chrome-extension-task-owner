import { useEffect, MouseEvent } from 'react'
import interact from 'interactjs'
import { useAtom } from 'jotai'

import {
  //
  CLS_DROP_ZONE,
  CLS_DROPPABLE_HANDLE,
  CLS_DRAGGABLE_HANDLE,
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
} from '@/utils/event-bus'
import { logger } from '@/utils/logger'
import { showToast } from '@/utils/toast'

import { jotaiDragMoving } from '@/jotai/draggable'

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
  logger('updateDragMovingState', isMoving, fromX)
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
  const [_, setDragMoving] = useAtom(jotaiDragMoving)

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
        dropZoneEle.classList.add(cls)
      },
      // 拖拽离开
      ondragleave: function (event) {
        const dropzoneEle = event.target

        const cls = dropzoneEle.getAttribute(DatasetKeyDropZoneHighlightClass)
        dropzoneEle.classList.remove(cls)
      },
      // 拖拽放下
      ondrop: function (event) {
        const dropzoneEle = event.target
        const draggableEle = event.relatedTarget

        const action: Type_Dataset_DropZone = dropzoneEle.getAttribute(DatasetKeyDropZoneType)
        const targetTaskUniqueId = draggableEle.getAttribute(DatasetKeyDragCardUniqueId)
        // alert(`Dropped - ${action} - ${targetTaskUniqueId}`)
        if (action === 'confirm') {
          const newCardStatus: Type_Dataset_DragCardTempState = 'confirmed'
          draggableEle.setAttribute(DatasetKeyDragCardStatus, newCardStatus)
          const updateProps: Type_EB_UpdateTaskProps = {
            scene: 'status',
            createTimestamp: Number(targetTaskUniqueId),
            updateInfo: {
              status: 'confirmed',
            },
          }
          EventBus.emit(E_KEY_FROM_DRAG_HOOK_TO_DRAGGABLE_UPDATE_VALUE, updateProps)
        } else if (action === 'edit') {
          showToast({ text: '编辑暂不支持' })
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
