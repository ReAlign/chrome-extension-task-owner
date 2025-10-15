import { atom, useAtom } from 'jotai'
import showdown from 'showdown'

const jotaiShowdown = atom(
  new showdown.Converter({
    tasklists: true, // checkbox
    disableForced4SpacesIndentedSublists: true, // nested lists
  }),
)

export const useJotaiShowdown = () => {
  const [showdownIns] = useAtom(jotaiShowdown)

  return {
    showdownIns,
  }
}
