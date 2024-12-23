import { useEffect, useRef, useState } from 'react'
import { addChat } from '../store/actions/chat.actions'
import { LuSendHorizonal } from 'react-icons/lu'
import { socketService } from '../services/socket.service'
import { t } from 'i18next'

export function ChatInput({ toUserId, user }) {
   const [msg, setMsg] = useState('')
   const typingTimeout = useRef(null)


   useEffect(() => {
      if (!socketService.isConnected()) {
         socketService.setup()
      }
      return () => {
         socketService.terminate()
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
         socketService.emit('typing', { toUserId, fromUserId: user._id })

         typingTimeout.current = setTimeout(() => {
            socketService.emit('offTyping')
         }, 2000)
      } else {
         console.log('Cannot emit typing')
      }
   }

   async function onSend() {
      try {
         const chat = {
            toUserId: toUserId,
            fromUserId: user._id,
            msg: msg,
            createdAt: Date.now(),
            isRead: false,
         }
         if (socketService.isConnected()) {
            socketService.emit('offTyping')
         }
         await addChat(chat)
         setMsg('')
      } catch (err) {
         console.log('Cannot send message', err)
      }
   }

   return (
      <div className='chat-input'>
         {toUserId && (
            <input
               type='text'
               value={msg}
               onChange={handleChange}
               placeholder={t('Type a message...')}
               onKeyDown={ev => ev.key === 'Enter' && onSend()}
            />
         )}
         {toUserId && msg && (
            <button className='send-btn' onClick={onSend}>
               <LuSendHorizonal style={{
                  rotate: localStorage.getItem('language') === 'he' ? '180deg' : '0deg',
               }} />
            </button>
         )}
      </div>
   )
}
