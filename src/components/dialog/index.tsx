import {
  //
  // useState,
  // useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from 'react'

type T_DialogModalProps = {
  children: ReactNode
  // name: string
}

export type T_DialogModalHandle = {
  open: () => void
  close: () => void
}

const DialogModal = forwardRef<
  //
  T_DialogModalHandle,
  T_DialogModalProps
>(({ children }, ref) => {
  const dialogModalRef = useRef<HTMLDialogElement>(null)

  useImperativeHandle(ref, () => ({
    open: () => {
      dialogModalRef.current?.showModal()
    },
    close: () => {
      dialogModalRef.current?.close()
    },
  }))

  return (
    <dialog
      ref={dialogModalRef}
      onCancel={() => {
        dialogModalRef.current?.close()
      }}
    >
      {children}
    </dialog>
  )
})

DialogModal.displayName = 'DialogModal'

export {
  //
  DialogModal,
}
