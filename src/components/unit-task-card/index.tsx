import { CSSProperties } from 'react'
import { useLongPress } from 'use-long-press'

import {
  //
  CLS_DRAGGABLE_HANDLE,
  CLS_DROPPABLE_HANDLE,
  CLS_SHOWDOWN_BODY,
  DatasetKeyDragCardUniqueId,
} from '@/constants'
import { useJotaiDraggable, useJotaiShowdown } from '@/jotai'

import './index.scss'

export const UnitTaskCard = ({
  //
  taskInfo,
}: {
  taskInfo: Type_TaskInfo
}) => {
  const { dragMoving } = useJotaiDraggable()
  const { showdownIns } = useJotaiShowdown()

  const getPositionStyles = (): CSSProperties => {
    const positionLeft = taskInfo.positionX === -1 ? 0 : taskInfo.positionX
    const positionTop = taskInfo.positionY === -1 ? 0 : taskInfo.positionY

    return {
      left: `${positionLeft}px`,
      top: `${positionTop}px`,
    }
  }
  const handlers = useLongPress(() => {
    if (dragMoving) {
      return
    }

    console.log('Long pressed!')
  })

  return (
    <>
      {taskInfo.status === 'confirmed' ? null : (
        <div
          //
          {...{ [DatasetKeyDragCardUniqueId]: taskInfo.createTimestamp }}
          className={`${CLS_DRAGGABLE_HANDLE} ${CLS_DROPPABLE_HANDLE} bz-unit-task-card-item`}
          style={getPositionStyles()}
          {...handlers()}
        >
          <div
            className="bz-unit-task-card-item-inner"
            style={{
              transform: `rotate(${taskInfo.contentRotate}deg)`,
            }}
          >
            {/* <div className="bz-unit-task-card-item-inner-shadow-top" /> */}
            <div className="bz-unit-task-card-item-body">
              <div
                className={CLS_SHOWDOWN_BODY}
                dangerouslySetInnerHTML={{
                  __html: showdownIns.makeHtml(taskInfo.content),
                }}
              />
            </div>
            <div className="bz-unit-task-card-item-inner-shadow-bottom" />
          </div>
        </div>
      )}
    </>
  )
}
