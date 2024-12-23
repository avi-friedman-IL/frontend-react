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
import { loadUsers, updateLoggedUser } from '../store/actions/user.actions'

export function ChatIndex() {
   const user = useSelector(state => state.userModule.user)
   const users = useSelector(state => state.userModule.users)
   const chats = useSelector(state => state.chatModule.chats)
   const filterBy = useSelector(state => state.chatModule.filterBy)
   const isLoading = useSelector(state => state.chatModule.isLoading)

   // console.log('user:', user)

   const dispatch = useDispatch()

   useEffect(() => {
      load()
   }, [chats.length, filterBy])

   useEffect(() => {
      socketService.setup()
      if (!filterBy.toUserId) return

      socketService.on('chat-add', onChatAdd)
      return () => {
         socketService.off('chat-add', onChatAdd)
         socketService.terminate()
      }
   }, [filterBy])

   useEffect(() => {
      if (!socketService.isConnected()) socketService.setup()

      socketService.on('chat-update', onChatUpdate)
      socketService.on('chat-remove', onRemoveFromStore)
      return () => {
         socketService.off('chat-update', onChatUpdate)
         socketService.off('chat-remove', onRemoveFromStore)
      }
   }, [])

   async function load() {
      if (isLoading) return
      // if (!filterBy.toUserId) return
      try {
         const [chats, allChats] = await Promise.all([
            loadChats(filterBy),
            loadAllChats(),
            loadUsers(),
         ])
         // await loadChats(filterBy)
         // await loadAllChats()
         await isRead(chats)
      } catch (err) {
         console.log('Cannot load chats', err)
      }
   }

   async function sortContacts() {
      if (!user?.contacts) return
      const sortedContacts = user?.contacts.sort((a, b) => {
         const chatA = chats.find(chat => chat.fromUserId === a._id)
         const chatB = chats.find(chat => chat.fromUserId === b._id)
         if (!chatA && !chatB) return 0
         if (!chatA) return 1
         if (!chatB) return -1
         return chatB.createdAt - chatA.createdAt
      })
      const updatedUser = { ...user, contacts: sortedContacts }
      await updateLoggedUser(updatedUser)
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
      if (newChat.fromUserId === user._id) return

      const chatExists = chats.some(chat => chat._id === newChat._id)
      if (!chatExists) {
         dispatch({ type: ADD_CHAT, chat: newChat })
      }
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

   if (!chats || !users) return
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
         <ChatInput toUserId={filterBy.toUserId} user={user} />
      </section>
   )
}
