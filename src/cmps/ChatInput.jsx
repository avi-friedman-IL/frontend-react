import { useEffect, useRef, useState } from 'react'
import { LuSendHorizonal } from 'react-icons/lu'
import { socketService } from '../services/socket.service'
import { t } from 'i18next'

export function ChatInput({ toUserId, toGroupId, user }) {
   const [msg, setMsg] = useState('')
   const typingTimeout = useRef(null)

   useEffect(() => {
      if (!socketService.isConnected()) socketService.setup()
      return () => {
         if (typingTimeout.current) {
            clearTimeout(typingTimeout.current)
         }
         // socketService.terminate()
      }
   }, [])

   function handleChange(ev) {
      ev.preventDefault()
      setMsg(ev.target.value)
      handleTyping(ev)
   }

   async function handleTyping() {
      if (typingTimeout.current) {
         clearTimeout(typingTimeout.current)
      }
      if (socketService.isConnected()) {
         socketService.emit('typing', {
            toUserId,
            fromUserId: user._id,
            toGroupId,
         })

         typingTimeout.current = setTimeout(() => {
            socketService.emit('offTyping')
         }, 2000)
      } else {
         console.log('Cannot emit typing')
      }
   }

   async function onSend() {
      try {
         const chat = toUserId
            ? {
                 toUserId: toUserId,
                 fromUserId: user._id,
                 msg: msg,
                 createdAt: Date.now(),
                 isRead: false,
              }
            : {
                 toGroupId: toGroupId,
                 fromUserId: user._id,
                 msg: msg,
                 createdAt: Date.now(),
                 isRead: false,
              }
         if (socketService.isConnected()) {
            socketService.emit('offTyping')
            socketService.emit('chat-add', chat)
         }
         // await addChat(chat)
         setMsg('')
      } catch (err) {
         console.log('Cannot send message', err)
      }
   }

   if (!toUserId && !toGroupId) return
   return (
      <div className='chat-input'>
         <input
            type='text'
            value={msg}
            onChange={handleChange}
            placeholder={t('Type a message...')}
            onKeyDown={ev => ev.key === 'Enter' && onSend()}
         />

         {msg && (
            <button className='send-btn' onClick={onSend}>
               <LuSendHorizonal
                  style={{
                     rotate:
                        localStorage.getItem('language') === 'he'
                           ? '180deg'
                           : '0deg',
                  }}
               />
            </button>
         )}
      </div>
   )
}
