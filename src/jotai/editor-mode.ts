import { atom, useAtom } from 'jotai'

const jotaiEditorMode = atom<{
  //
  mode: 'add' | 'edit'
  uniqueId: null | number
}>({
  mode: 'add', // 编辑器模式，'add' 或 'edit'
  uniqueId: null, // 当前编辑的任务卡片的唯一标识符，null 表示没有选中任何任务卡片
})

export const useJotaiEditorMode = () => {
  const [editorMode, setEditorMode] = useAtom(jotaiEditorMode)

  return {
    editorMode,
    setEditorMode,
  }
}
