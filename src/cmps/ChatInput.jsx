import { useEffect, useRef, useState } from 'react'

import Modal from 'react-modal'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import { LuSendHorizonal } from 'react-icons/lu'
import { socketService } from '../services/socket.service'
import { MdInsertEmoticon } from 'react-icons/md'
import { t } from 'i18next'
import { AttachFile } from './AttachFile.jsx'
import { FilePreview } from './FilePreview.jsx'

export function ChatInput({ toUserId, toGroupId, user }) {
   const [msg, setMsg] = useState('')
   const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false)
   const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
   const [selectedFile, setSelectedFile] = useState(null)
   const [filePreview, setFilePreview] = useState(null)
   const [fileUrl, setFileUrl] = useState(null)

   const typingTimeout = useRef(null)
   const inputRef = useRef(null)
   const btnRef = useRef(null)
   const fileInputRef = useRef(null)
   Modal.setAppElement('#root')

   function handleFileChange(ev) {
      const file = ev.target.files[0]
      if (file) {
         setSelectedFile(file)
         // Generate preview based on file type
         if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = e => setFilePreview(e.target.result)
            reader.readAsDataURL(file)
         } else {
            // For non-image files, just show file name
            setFilePreview(file.name)
         }
         // Create URL for file download
         setFileUrl(URL.createObjectURL(file))
         console.log('File selected:', file)
      }
   }

   function removeFile() {
      setSelectedFile(null)
      setFilePreview(null)
      setFileUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = null
   }

   useEffect(() => {
      if (!socketService.isConnected()) socketService.setup()
      return () => {
         if (typingTimeout.current) {
            clearTimeout(typingTimeout.current)
         }
         if (fileUrl) {
            URL.revokeObjectURL(fileUrl)
         }
      }
   }, [fileUrl])

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
         let fileData = null
         if (selectedFile) {
            // קריאת תוכן הקובץ כ-base64
            fileData = await new Promise((resolve) => {
               const reader = new FileReader()
               reader.onload = () => resolve(reader.result)
               reader.readAsDataURL(selectedFile)
            })
         }
         const chat = toUserId
            ? {
                 toUserId: toUserId,
                 fromUserId: user._id,
                 msg: msg,
                 createdAt: Date.now(),
                 isRead: false,
                 file: selectedFile
                    ? {
                         name: selectedFile.name,
                         type: selectedFile.type,
                         size: selectedFile.size,
                         data: fileData,
                      }
                    : null,
              }
            : {
                 toGroupId: toGroupId,
                 fromUserId: user._id,
                 msg: msg,
                 createdAt: Date.now(),
                 isRead: false,
                 file: selectedFile
                    ? {
                         name: selectedFile.name,
                         type: selectedFile.type,
                         size: selectedFile.size,
                         data: fileData,
                      }
                    : null,
              }
         if (socketService.isConnected()) {
            if (!msg.trim() && !selectedFile) return
            socketService.emit('offTyping')
            socketService.emit('chat-add', chat)
         }
         setMsg('')
         removeFile()
      } catch (err) {
         console.log('Cannot send message', err)
      }
   }

   if (!toUserId && !toGroupId || toGroupId && !user.groups?.length) return
   return (
      <div className='chat-input'>
         <div className='chat-input-actions'>
            <AttachFile
               handleFileChange={handleFileChange}
               fileInputRef={fileInputRef}
            />
            {filePreview && (
               <FilePreview 
                  selectedFile={selectedFile}
                  filePreview={filePreview}
                  removeFile={removeFile}
               />
            )}
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
         </div>
         <input
            ref={inputRef}
            type='text'
            value={msg}
            onChange={handleChange}
            placeholder={t('Type a message...')}
            onKeyDown={ev => ev.key === 'Enter' && onSend()}
         />

         {(msg || selectedFile) && (
            <button className='send-btn' onClick={onSend}>
               <LuSendHorizonal
                  style={{
                     rotate: '180deg',
                  }}
               />
            </button>
         )}
      </div>
   )
}
