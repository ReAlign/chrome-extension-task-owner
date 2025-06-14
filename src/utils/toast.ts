import Toastify from 'toastify-js'

export const showToast = ({
  //
  text,
  duration = 3000,
}: {
  text: string
  duration?: number
}) => {
  Toastify({
    text,
    duration,
  }).showToast()
}
