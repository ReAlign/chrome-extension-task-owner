import { getRandomIntInclusive } from '@/utils/number'

export const generateNewTaskInfo = ({ value }: { value: string }) => {
  const ts = Date.now()

  const newTaskInfo: Type_TaskInfo = {
    createTimestamp: ts,
    status: 'normal',
    latestUpdateTimestamp: ts,
    content: value,
    positionX: -1,
    positionY: -1,
    contentRotate: getRandomIntInclusive(-10, 10),
  }

  return newTaskInfo
}
