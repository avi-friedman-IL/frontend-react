import { useEffect, useRef, useState } from 'react'

import Modal from 'react-modal'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import { LuSendHorizonal } from 'react-icons/lu'
import { socketService } from '../services/socket.service'
import { MdInsertEmoticon } from 'react-icons/md'
import { t } from 'i18next'

export function ChatInput({ toUserId, toGroupId, user }) {
   const [msg, setMsg] = useState('')
   const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false)
   const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })

   const typingTimeout = useRef(null)
   const inputRef = useRef(null)
   const btnRef = useRef(null)
   Modal.setAppElement('#root')

   useEffect(() => {
      if (!socketService.isConnected()) socketService.setup()
      return () => {
         if (typingTimeout.current) {
            clearTimeout(typingTimeout.current)
         }
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

   function handleSelectEmoji(emoji) {
      setMsg(msg + emoji.native)
      setIsOpenEmojiPicker(false)
      inputRef.current.focus()
   }

   function onOpenModal() {
      setIsOpenEmojiPicker(true)
      setModalPosition({
         x: btnRef.current.getBoundingClientRect().left - 200,
         y: btnRef.current.getBoundingClientRect().top - 500,
      })
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
            if(!msg.trim()) return
            socketService.emit('offTyping')
            socketService.emit('chat-add', chat)
         }
         setMsg('')
      } catch (err) {
         console.log('Cannot send message', err)
      }
   }

   if (!toUserId && !toGroupId) return
   return (
      <div className='chat-input'>
         <Modal
            className='modal-emoji-picker'
            aria-hidden={isOpenEmojiPicker}
            isOpen={isOpenEmojiPicker}
            onRequestClose={() => setIsOpenEmojiPicker(false)}
            style={{
               overlay: {
                  backgroundColor: 'transparent',
               },
               content: {
                  position: 'absolute',
                  top: modalPosition.y,
                  left: modalPosition.x,
                  right: 'auto',
                  bottom: 'auto',
                  width: 'max-content',
                  padding: '0',
                  overflow: 'hidden',

                  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
               },
               
            }}>
            <Picker
               data={data}
               onEmojiSelect={handleSelectEmoji}
               theme='light'
               emojiSize={24}
            />
         </Modal>
         <span className='emoji-btn' ref={btnRef} onClick={onOpenModal}>
            <MdInsertEmoticon />
         </span>
         <input
            ref={inputRef}
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
