import { useEffect } from 'react'
import { ContactsIndex } from '../cmps/ContactsIndex'
import {
   loadAllChats,
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
import { loadUsers, updateUser } from '../store/actions/user.actions'

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
      // socketService.getSocketId()
      socketService.on('chat-add', onChatAdd)
      socketService.on('chat-update', onChatUpdate)
      socketService.on('chat-remove', onRemoveFromStore)
      return () => {
         socketService.off('chat-add', onChatAdd)
         socketService.off('chat-update', onChatUpdate)
         socketService.off('chat-remove', onRemoveFromStore)
         // socketService.logout()
      }
   }, [filterBy?.toUserId, filterBy?.toGroupId])

   async function load() {
      if (isLoading) return
      if (!filterBy.toUserId && !filterBy.toGroupId) return
      try {
         await loadChats(filterBy)
         await loadUsers()
      } catch (err) {
         console.log('Cannot load chats', err)
      }
   }

   async function isRead(chats) {
      chats.forEach(async chat => {
         if (
            chat.toUserId === user._id &&
            filterBy.toUserId === chat.fromUserId &&
            !chat.isRead
         ) {
            const chatToRead = { ...chat, isRead: true }
            await updateChat(chatToRead)
         }
      })
   }

   async function onChatAdd(newChat) {
      dispatch({ type: ADD_CHAT, chat: newChat })
   }

   async function onChatUpdate(chat) {
      dispatch({ type: UPDATE_CHAT, chat })
   }

   async function onRemove(chatId) {
      try {
         await removeChat(chatId)
         showSuccessMsg('Chat removed')
      } catch (err) {
         console.log('Cannot remove chat', err)
         showErrorMsg('Cannot remove chat')
      }
   }

   async function onRemoveFromStore(chatId) {
      dispatch({ type: REMOVE_CHAT, chatId })
   }

   async function onUpdate(chat) {
      try {
         await updateChat(chat)
         socketService.emit('chat-update', chat)
         showSuccessMsg('Chat updated')
      } catch (err) {
         console.log('Cannot update chat', err)
         showErrorMsg('Cannot update chat')
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
