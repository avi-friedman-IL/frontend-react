import { useEffect, useRef, useCallback } from 'react'
import { formatChatDate } from '../services/util.service'
import { t } from 'i18next'

export function ChatMsgs({
   selectedChat,
   onDeleteMsg,
   loggedinUser,
   onReadMsg,
   onQuoteMsg,
}) {
   const msgRefs = useRef({})
   const observerRef = useRef(null)
   const chatMsgsRef = useRef(null)

   const handleIntersection = useCallback(
      entries => {
         entries.forEach(entry => {
            try {
               const msgId = entry.target.dataset.messageId
               const msg = selectedChat.msgs.find(msg => msg.id === msgId)
               if (
                  entry.isIntersecting &&
                  msg &&
                  msg.fromId !== loggedinUser._id &&
                  !msg.isRead
               ) {
                  onReadMsg(msg)
               }
            } catch (error) {
               console.error('Error handling intersection:', error)
            }
         })
      },
      [selectedChat.msgs, loggedinUser._id, onReadMsg]
   )

   // Auto-scroll to first unread message or bottom
   const scrollToUnreadOrBottom = useCallback(() => {
      if (!chatMsgsRef.current) return

      const unreadMsg = selectedChat.msgs.find(
         msg => msg.fromId !== loggedinUser._id && !msg.isRead
      )

      if (unreadMsg) {
         // Scroll to last unread message
         const unreadElement = msgRefs.current[unreadMsg.id]
         if (unreadElement) {
            unreadElement.scrollIntoView({
               behavior: 'smooth',
               block: 'center',
            })
         }
      } else {
         // Scroll to bottom if all messages are read
         chatMsgsRef.current.scrollTop = chatMsgsRef.current.scrollHeight
      }
   }, [selectedChat.msgs, loggedinUser._id])

   useEffect(() => {
      const observer = new IntersectionObserver(handleIntersection, {
         threshold: 1.0,
         rootMargin: '0px 0px -50px 0px',
      })

      observerRef.current = observer

      Object.values(msgRefs.current).forEach(el => {
         if (el && el instanceof Element) {
            observer.observe(el)
         }
      })

      return () => {
         observer.disconnect()
      }
   }, [handleIntersection])

   useEffect(() => {
      return () => {
         msgRefs.current = {}
      }
   }, [])

   useEffect(() => {
      if (observerRef.current) {
         Object.values(msgRefs.current).forEach(el => {
            if (el && el instanceof Element) {
               observerRef.current.observe(el)
            }
         })
      }
   }, [selectedChat.msgs])

   // Auto-scroll when messages change
   useEffect(() => {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
         scrollToUnreadOrBottom()
      }, 100)

      return () => clearTimeout(timer)
   }, [selectedChat.msgs, scrollToUnreadOrBottom])

   return (
      <section className='chat-msgs' ref={chatMsgsRef}>
         <ul>
            {selectedChat.msgs.map(msg => (
               <li
                  key={msg.id}
                  ref={el => {
                     msgRefs.current[msg.id] = el
                     if (el && observerRef.current) {
                        observerRef.current.observe(el)
                     }
                  }}
                  data-message-id={msg.id}>
                  <div className='info'>
                     <p>{msg.from}</p>
                  </div>
                  <div className='content'>
                     {msg.quote && (
                        <div className='quote-msg'>
                           <p className='from'>{msg.quote.from}</p>
                           <p className='txt'>{msg.quote.txt}</p>
                        </div>
                     )}
                     <p>{msg.txt}</p>
                  </div>
                  <div className='date'>
                     <p>{formatChatDate(msg.createdAt)}</p>
                  </div>
                  <div className='btns'>
                     <button
                        onClick={() => onQuoteMsg(msg)}
                        className='edit-btn'>
                        {t('Quote')}
                     </button>
                     {(selectedChat.ownerId === loggedinUser._id ||
                        msg.fromId === loggedinUser._id) && (
                           <button
                              onClick={() => onDeleteMsg(msg.id)}
                              className='delete-btn'>
                              {t('Delete')}
                           </button>
                        )}
                  </div>
               </li>
            ))}
         </ul>
      </section>
   )
}
