import { useEffect, MouseEvent } from 'react'
import interact from 'interactjs'

export const useTaskDraggable = () => {
  useEffect(() => {
    // target elements with the "draggable" class
    interact('.draggable').draggable({
      // enable inertial throwing
      inertia: true,
      // keep the element within the area of it's parent
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true,
        }),
      ],
      // enable autoScroll
      autoScroll: true,

      listeners: {
        // call this function on every dragmove event
        move: dragMoveListener,

        // call this function on every dragend event
        end(/* _event */) {
          // var textEl = event.target.querySelector('p');
          // textEl &&
          //   (textEl.textContent =
          //     'moved a distance of ' +
          //     Math.sqrt(
          //       (Math.pow(event.pageX - event.x0, 2) +
          //         Math.pow(event.pageY - event.y0, 2)) |
          //         0
          //     ).toFixed(2) +
          //     'px');
        },
      },
    })

    function dragMoveListener(event: MouseEvent<HTMLLIElement>) {
      const target = event.target as HTMLElement
      if (target) {
        // keep the dragged position in the data-x/data-y attributes
        const x = Number((parseFloat(`${target.getAttribute('data-x')}`) || 0) + (event as any).dx)
        const y = Number((parseFloat(`${target.getAttribute('data-y')}`) || 0) + (event as any).dy)

        // translate the element
        target.style.transform = `translate(${x}px, ${y}px)`

        // update the posiion attributes
        target.setAttribute('data-x', `${x}`)
        target.setAttribute('data-y', `${y}`)
      }
    }
  }, [])
}
