import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import {
   addChat,
   deleteChat,
   getChats,
   setSelectedChat,
   updateChat,
} from '../store/actions/chat.actions'
import { ChatList } from '../cmps/ChatList.jsx'
import { ChatForm } from '../cmps/ChatForm.jsx'
import { loadUsers } from '../store/actions/user.actions.js'
import {
   SOCKET_EVENT_CHAT_REMOVED,
   SOCKET_EVENT_CHAT_ADDED,
   socketService,
   SOCKET_EVENT_USER_UPDATED,
   SOCKET_EVENT_CHAT_UPDATED,
} from '../services/socket.service.js'
import {
   ADD_CHAT,
   DELETE_CHAT,
   UPDATE_CHAT,
} from '../store/reducers/chat.reducer.js'
import { SET_USER, UPDATE_USER } from '../store/reducers/user.reducer.js'
import { NewChat } from '../cmps/NewChat.jsx'
import { userService } from '../services/user'
import { ChatMsgs } from '../cmps/ChatMsgs.jsx'
import { t } from 'i18next'

export function ChatIndex() {
   const chats = useSelector(store => store.chatModule.chats)
   const users = useSelector(store => store.userModule.users)
   const user = useSelector(store => store.userModule.user)
   const selectedChat = useSelector(store => store.chatModule.selectedChat)
   const isLoading = useSelector(store => store.chatModule.isLoading)

   const [isNewChatOpen, setIsNewChatOpen] = useState(false)
   const [selectedChatId, setSelectedChatId] = useState(null)
   const [quoteMsg, setQuoteMsg] = useState(null)

   const dispatch = useDispatch()

   useEffect(() => {
      loadCmp()
      console.log('loading chats...')
   }, [])

   useEffect(() => {
      setSelectedChat(selectedChatId)
      setQuoteMsg(null)
      console.log('loading chat...')
   }, [selectedChatId, selectedChat?.msgs?.length])

   useEffect(() => {
      socketService.on(SOCKET_EVENT_CHAT_ADDED, chat => {
         dispatch({ type: ADD_CHAT, chat: chat })
      })
      socketService.on(SOCKET_EVENT_CHAT_UPDATED, chat => {
         dispatch({ type: UPDATE_CHAT, chat: chat })
      })
      socketService.on(SOCKET_EVENT_CHAT_REMOVED, chatId => {
         dispatch({ type: DELETE_CHAT, chatId: chatId })
      })
      socketService.on(SOCKET_EVENT_USER_UPDATED, updatedUser => {
         dispatch({ type: UPDATE_USER, user: updatedUser })
         if (updatedUser._id === user._id) {
            dispatch({ type: SET_USER, user: updatedUser })
         }
      })
      return () => {
         socketService.off(SOCKET_EVENT_CHAT_ADDED)
         socketService.off(SOCKET_EVENT_CHAT_UPDATED)
         socketService.off(SOCKET_EVENT_CHAT_REMOVED)
         socketService.off(SOCKET_EVENT_USER_UPDATED)
      }
   }, [])

   async function loadCmp() {
      const filter = {
         isAdmin: user.isAdmin,
         gender: user.gender,
         isTeamManager: user.isTeamManager,
      }
      try {
         await getChats({ userId: user._id })
         await loadUsers(filter)
      } catch (err) {
         console.log('err:', err)
      }
   }

   async function onRemoveChat(ev, chatId) {
      ev.stopPropagation()
      const confirm = window.confirm(
         t('Are you sure you want to delete this chat?')
      )
      if (!confirm) return
      try {
         await deleteChat(chatId)
         if (selectedChatId === chatId) setSelectedChatId(null)
      } catch (err) {
         console.log('err:', err)
      }
   }

   async function onAddChat(toId) {
      try {
         const toUser = await userService.getById(toId)
         const chatToAdd = {
            toId: toId,
            to: toUser.fullname,
            ownerId: user._id,
            owner: user.fullname,
            msgs: [],
         }
         const newChat = await addChat(chatToAdd)
         setSelectedChatId(newChat._id)
         setIsNewChatOpen(false)
      } catch (err) {
         console.log('err:', err)
      }
   }

   async function onAddGroup(group) {
      const groupToAdd = {
         ownerId: user._id,
         owner: user.fullname,
         groupUsers: group.groupUsers,
         name: group.name,
         msgs: [],
      }
      try {
         const newChat = await addChat(groupToAdd)
         setSelectedChatId(newChat._id)
         setIsNewChatOpen(false)
      } catch (err) {
         console.log('err:', err)
      }
   }

   async function onDeleteMsg(msgId) {
      const confirm = window.confirm(
         t('Are you sure you want to delete this message?')
      )
      if (!confirm) return
      try {
         const updatedChat = {
            ...selectedChat,
            msgs: selectedChat.msgs.filter(msg => msg.id !== msgId),
         }
         await updateChat(updatedChat)
      } catch (err) {
         console.log('err:', err)
      }
   }

   async function onReadMsg(msg) {
      try {
         const updatedChat = {
            ...selectedChat,
            msgs: selectedChat.msgs.map(msg =>
               msg.id === msg.id ? { ...msg, isRead: true } : msg
            ),
         }
         await updateChat(updatedChat)
      } catch (err) {
         console.log('err:', err)
      }
   }

   async function onQuoteMsg(msg) {
      setQuoteMsg(msg)
   }

   const isAuthorized =
      selectedChat?.ownerId === user._id || !selectedChat?.groupUsers
   if (!user || !users || !chats) return
   return (
      <section className='chat-index'>
         <div className='new-chat-container'>
            <button
               className='new-chat-btn'
               onClick={() => setIsNewChatOpen(!isNewChatOpen)}>
               {t('New Chat')}
            </button>
            {isNewChatOpen && (
               <NewChat
                  loggedinUser={user}
                  users={users}
                  onAddChat={onAddChat}
                  onAddGroup={onAddGroup}
                  setIsNewChatOpen={setIsNewChatOpen}
               />
            )}
         </div>
         <ChatList
            chats={chats}
            onRemoveChat={onRemoveChat}
            setSelectedChatId={setSelectedChatId}
            selectedChatId={selectedChatId}
            loggedinUser={user}
         />
         {selectedChat && (
            <ChatMsgs
               selectedChat={selectedChat}
               onDeleteMsg={onDeleteMsg}
               loggedinUser={user}
               onReadMsg={onReadMsg}
               onQuoteMsg={onQuoteMsg}
            />
         )}
         {selectedChat && isAuthorized && (
            <ChatForm
               selectedChat={selectedChat}
               loggedinUser={user}
               isLoading={isLoading}
               quoteMsg={quoteMsg}
               setQuoteMsg={setQuoteMsg}
            />
         )}
      </section>
   )
}
