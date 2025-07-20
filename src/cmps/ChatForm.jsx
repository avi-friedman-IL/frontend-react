import { useState } from 'react'
import { updateChat } from '../store/actions/chat.actions'
import { updateUser } from '../store/actions/user.actions'
import { userService } from '../services/user'
import { makeId } from '../services/util.service'
import { t } from 'i18next'

export function ChatForm({ selectedChat, loggedinUser, isLoading, quoteMsg, setQuoteMsg }) {
   const [txt, setTxt] = useState('')
   async function onSave(ev) {
      ev.preventDefault()
      if (!txt) return
      try {
         const msgToSave = {
            quote: quoteMsg ? quoteMsg : null,
            id: makeId(),
            txt: txt,
            from: loggedinUser.fullname,
            fromId: loggedinUser._id,
            createdAt: Date.now(),
            isRead: false,
         }
         const chatToSave = {
            ...selectedChat,
            msgs: [...selectedChat.msgs, msgToSave],
         }
         setTxt('')
         setQuoteMsg(null)
         await updateChat(chatToSave)
      } catch (err) {
         console.error('Failed to save chat', err)
      }
   }

   async function _updateUserWithUnreadChat(toId) {
      const userToUpdate = await userService.getById(toId)
      const unreadChats = [
         ...(userToUpdate.unreadChats || []),
         { fromId: loggedinUser._id, toId: toId },
      ]
      const updatedUser = {
         ...userToUpdate,
         unreadChats: unreadChats,
      }
      try {
         await updateUser(updatedUser)
      } catch (err) {
         console.error('Failed to update user', err)
      }
   }

   function onChange(ev) {
      const value = ev.target.value
      setTxt(value)
   }

   function onKeyDown(ev) {
      if (ev.key === 'Enter' && !ev.shiftKey) {
         ev.preventDefault()
         onSave(ev)
      }
   }
   if (isLoading) return <div className='chat-form loading'></div>
   return (
      <form onSubmit={onSave} className='chat-form'>
         {quoteMsg && (
            <div className='quote-msg'>
               <button onClick={() => setQuoteMsg(null)}>X</button>
               <p className='from'>{quoteMsg.from}</p>
               <p className='txt'>{quoteMsg.txt}</p>
            </div>
         )}
         <textarea
            name='txt'
            value={txt}
            onChange={onChange}
            placeholder={t('Type a message...')}
            onKeyDown={onKeyDown}
            autoFocus
         />
      </form>
   )
}
