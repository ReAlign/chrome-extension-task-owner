import {
  //
  DatasetKeyDropZoneType,
  DatasetKeyDropZoneHighlightClass,
} from '@/constants'

export const DropZoneCommonAttachAttrs = {
  [DatasetKeyDropZoneType]: 'common',
}
export const DropZoneEditAttachAttrs = {
  [DatasetKeyDropZoneType]: 'edit',
  [DatasetKeyDropZoneHighlightClass]: 'bz-task-drop-area-edit-highlight',
}
export const DropZoneConfirmAttachAttrs = {
  [DatasetKeyDropZoneType]: 'confirm',
  [DatasetKeyDropZoneHighlightClass]: 'bz-task-drop-area-confirm-highlight',
}

export const IconProps = {
  size: 96,
  color: '#fff',
}
