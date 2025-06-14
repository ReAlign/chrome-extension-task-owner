import { atom } from 'jotai'
import showdown from 'showdown'

export const jotaiShowdown = atom(
  new showdown.Converter({
    tasklists: true,
  }),
)
