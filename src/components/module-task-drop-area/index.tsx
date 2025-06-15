import { CLS_DROP_ZONE } from '@/constants'
import { IconEdit, IconConfirm } from '@/components/icon'
import { useJotaiDraggable } from '@/jotai'

import {
  //
  DropZoneCommonAttachAttrs,
  DropZoneEditAttachAttrs,
  DropZoneConfirmAttachAttrs,
  IconProps,
} from './config'

import './index.scss'

export const ModuleTaskDropArea = ({
  //
  classname,
}: {
  classname: string
}) => {
  const { dragMoving } = useJotaiDraggable()

  return (
    <div
      className={`${classname} bz-task-drop-area-container`}
      style={
        dragMoving
          ? {
              display: 'block',
            }
          : {}
      }
    >
      <div
        //
        {...DropZoneCommonAttachAttrs}
        className={`${CLS_DROP_ZONE} bz-task-drop-area-top-area`}
      />
      <div
        //
        {...DropZoneEditAttachAttrs}
        className={`${CLS_DROP_ZONE} bz-task-drop-area-sub-area edit`}
      >
        <IconEdit {...IconProps} />
      </div>
      <div
        //
        {...DropZoneConfirmAttachAttrs}
        className={`${CLS_DROP_ZONE} bz-task-drop-area-sub-area confirm`}
      >
        <IconConfirm {...IconProps} />
      </div>
    </div>
  )
}
