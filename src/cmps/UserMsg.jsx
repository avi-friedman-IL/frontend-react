import { t } from 'i18next'
import { eventBus, showSuccessMsg } from '../services/event-bus.service'
import { useState, useEffect, useRef } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
// import { socketService, SOCKET_EVENT_REVIEW_ABOUT_YOU } from '../services/socket.service'

export function UserMsg() {
   const [msg, setMsg] = useState(null)
   const timeoutIdRef = useRef()

   useEffect(() => {
      const unsubscribe = eventBus.on('show-msg', msg => {
         setMsg(msg)
         if (timeoutIdRef.current) {
            timeoutIdRef.current = null
            clearTimeout(timeoutIdRef.current)
         }
         if (msg.type === 'respect') {
            return
         } else timeoutIdRef.current = setTimeout(closeMsg, 3000)
      })

      // socketService.on(SOCKET_EVENT_REVIEW_ABOUT_YOU, review => {
      // 	showSuccessMsg(`New review about me ${review.txt}`)
      // })

      return () => {
         unsubscribe()
         // socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU)
      }
   }, [msg?.type])

   function closeMsg() {
      setMsg(null)
   }

   function msgClass() {
      return msg ? 'visible' : ''
   }
   return (
      <section className={`user-msg ${msg?.type} ${msgClass()}`}>
         {msg?.type === 'respect' && (
            <button onClick={closeMsg}>
               <IoCloseSharp />
            </button>
         )}
         <p>{msg?.txt}</p>
      </section>
   )
}
