import { atom, useAtom } from 'jotai'
import showdown from 'showdown'

const jotaiShowdown = atom(
  new showdown.Converter({
    tasklists: true,
  }),
)

export const useJotaiShowdown = () => {
  const [showdownIns] = useAtom(jotaiShowdown)

  return {
    showdownIns,
  }
}
