import { atom, useAtom } from 'jotai'

const jotaiDragMoving = atom(false)

export const useJotaiDraggable = () => {
  const [dragMoving, setDragMoving] = useAtom(jotaiDragMoving)

  return {
    dragMoving,
    setDragMoving,
  }
}
