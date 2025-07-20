import { store } from '../store'
import { chatService } from '../../services/chat'
import {
   ADD_CHAT,
   DELETE_CHAT,
   SET_CHATS,
   SET_FILTER_BY,
   UPDATE_CHAT,
   SET_SELECTED_CHAT,
   IS_LOADING,
} from '../reducers/chat.reducer'

export async function getChats(filterBy = {}) {
   try {
      const chats = await chatService.query(filterBy)
      store.dispatch({ type: SET_CHATS, chats })
      return chats
   } catch (err) {
      console.error('Failed to get chats', err)
      throw err
   }
}

export async function getChatById(chatId) {
   try {
      const chat = await chatService.getById(chatId)
      return chat
   } catch (err) {
      console.error('Failed to get chat by id', err)
      throw err
   }
}

export async function addChat(chat) {
   try {
      const addedChat = await chatService.add(chat)
      store.dispatch({ type: ADD_CHAT, chat: addedChat })
      return addedChat
   } catch (err) {
      console.error('Failed to add chat', err)
      throw err
   }
}

export async function updateChat(chat) {
   try {
      store.dispatch({ type: IS_LOADING, isLoading: true })
      const updatedChat = await chatService.update(chat)
      store.dispatch({ type: UPDATE_CHAT, chat: chat })
      return updatedChat
   } catch (err) {
      console.error('Failed to update chat', err)
      throw err
   } finally {
      store.dispatch({ type: IS_LOADING, isLoading: false })
   }
}

export async function deleteChat(chatId) {
   try {
      await chatService.remove(chatId)
      store.dispatch({ type: DELETE_CHAT, chatId })
   } catch (err) {
      console.error('Failed to delete chat', err)
      throw err
   }
}

export async function setFilterBy(filterBy) {
   store.dispatch({ type: SET_FILTER_BY, filterBy })
}

export async function setSelectedChat(chatId) {
   store.dispatch({ type: SET_SELECTED_CHAT, chatId })
}
