import Events from 'events'

// Common, open dialog hotkeys
export const E_KEY_HOTKEY_DIALOG_HOTKEYS_OPEN =
  //
  'e-key-hotkey-dialog-hotkeys-open'
// Common, open dialog snippets
export const E_KEY_HOTKEY_DIALOG_SNIPPETS_OPEN =
  //
  'e-key-hotkey-dialog-snippets-open'

// CMD + S, Save Task, request get editor value
export const E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE =
  //
  'e-key-hotkey-meta-s-request-get-value'
// CMD + S, Save Task, response get editor value
export const E_KEY_HOTKEY_META_S_REQUEST_GET_VALUE_RESPONSE =
  //
  'e-key-hotkey-meta-s-request-get-value-response'
// Common, set editor value [reset / edit]
export const E_KEY_GLOBAL_REQUEST_SET_EDITOR_VALUE =
  //
  'e-key-global-request-set-editor-value'
// From top to draggable, save value
export const E_KEY_FROM_TOP_TO_DRAGGABLE_SAVE_NEW_VALUE =
  //
  'e-key-from-top-to-draggable-save-new-value'
export const E_KEY_FROM_TOP_TO_DRAGGABLE_SAVE_OLD_VALUE =
  //
  'e-key-from-top-to-draggable-save-old-value'

// From drag-hook to draggable, update value
export const E_KEY_FROM_DRAG_HOOK_TO_DRAGGABLE_UPDATE_VALUE =
  //
  'e-key-from-drag-hook-to-draggable-update-value'

export const EventBus = new Events()
