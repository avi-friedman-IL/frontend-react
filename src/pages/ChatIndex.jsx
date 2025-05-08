import { useEffect } from 'react'
import { ContactsIndex } from '../cmps/ContactsIndex'
import {
   loadChats,
   removeChat,
   updateChat,
} from '../store/actions/chat.actions'
import { useSelector } from 'react-redux'
import { ChatList } from '../cmps/ChatList'
import { ChatInput } from '../cmps/ChatInput'
import { socketService } from '../services/socket.service'
import { useDispatch } from 'react-redux'
import {
   ADD_CHAT,
   REMOVE_CHAT,
   UPDATE_CHAT,
} from '../store/reducers/chat.reducer'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { updateLoggedUser, updateUser } from '../store/actions/user.actions'
import { t } from 'i18next'

export function ChatIndex() {
   const user = useSelector(state => state.userModule.user)
   const users = useSelector(state => state.userModule.users)
   const chats = useSelector(state => state.chatModule.chats)
   const filterBy = useSelector(state => state.chatModule.filterBy)
   const isLoading = useSelector(state => state.chatModule.isLoading)

   const dispatch = useDispatch()

   useEffect(() => {
      load()
   }, [chats.length, filterBy?.toUserId, filterBy?.toGroupId])

   useEffect(() => {
      if (!socketService.isConnected()) {
         socketService.setup()
      }
      socketService.on('chat-add', onChatAdd)
      socketService.on('chat-update', onChatUpdate)
      socketService.on('chat-remove', onRemoveFromStore)
      socketService.on('updateLoggedUser', onUpdateLoggedUser)
      return () => {
         socketService.off('chat-add', onChatAdd)
         socketService.off('chat-update', onChatUpdate)
         socketService.off('chat-remove', onRemoveFromStore)
         socketService.off('updateLoggedUser', onUpdateLoggedUser)
      }
   }, [filterBy?.toUserId, filterBy?.toGroupId])

   async function load() {
      if (isLoading) return
      if (!filterBy.toUserId && !filterBy.toGroupId) return
      try {
         await loadChats(filterBy)
      } catch (err) {
         console.log('Cannot load chats', err)
      }
   }

   async function onChatAdd(newChat) {
      if (
         (newChat.fromUserId === filterBy.toUserId &&
            newChat.toUserId === user._id) ||
         (newChat.toUserId === filterBy.toUserId &&
            newChat.fromUserId === user._id) ||
         newChat.toGroupId === filterBy.toGroupId
      ) {
         dispatch({ type: ADD_CHAT, chat: newChat })
      }
      if (newChat.toGroupId) return
      UpdateUserWithNewMsgs(newChat)
   }

   async function onUpdateLoggedUser(updatedUser) {
      if (updatedUser._id === user._id) {
         await updateLoggedUser(updatedUser)
      }
   }

   async function UpdateUserWithNewMsgs(newChat) {
      const userToUpdate = users.find(user => user._id === newChat.fromUserId)
      const updatedUser = {
         ...userToUpdate,
         newMsgs: userToUpdate.newMsgs
            ? [
                 ...userToUpdate.newMsgs,
                 { fromUserId: newChat.fromUserId, toUserId: newChat.toUserId },
              ]
            : [{ fromUserId: newChat.fromUserId, toUserId: newChat.toUserId }],
      }
      await updateUser(updatedUser)
   }

   async function onChatUpdate(chat) {
      dispatch({ type: UPDATE_CHAT, chat })
   }

   async function onRemove(chatId) {
      try {
         await removeChat(chatId)
      } catch (err) {
         console.log('Cannot remove chat', err)
         showErrorMsg(t('לא ניתן למחוק צ\'אט'))
      }
   }

   async function onRemoveFromStore(chatId) {
      dispatch({ type: REMOVE_CHAT, chatId })
   }

   async function onUpdate(chat) {
      try {
         await updateChat(chat)
         socketService.emit('chat-update', chat)
         showSuccessMsg(t('הצ\'אט עודכן בהצלחה'))
      } catch (err) {
         console.log('Cannot update chat', err)
         showErrorMsg(t('לא ניתן לעדכן צ\'אט'))
      }
   }

   if (!chats || !users || !filterBy) return
   return (
      <section className='chat-index'>
        
         <ChatList
            chats={chats}
            user={user}
            users={users}
            onRemove={onRemove}
            onUpdate={onUpdate}
            filterBy={filterBy}
         />
         <ContactsIndex />
         <ChatInput
            toUserId={filterBy.toUserId}
            toGroupId={filterBy.toGroupId}
            user={user}
         />
      </section>
   )
}
