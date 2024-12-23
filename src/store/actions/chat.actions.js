import { chatService } from '../../services/chat'
import { store } from '../store'
import {
   ADD_CHAT,
   REMOVE_CHAT,
   SET_CHAT,
   UPDATE_CHAT,
   SET_FILTER,
   SET_LOADING,
   SET_ALL_CHATS,
} from '../reducers/chat.reducer'

export async function loadChats(filterBy = {}) {
   store.dispatch({ type: SET_LOADING, isLoading: true })
   try {
      const chats = await chatService.query(filterBy)
      store.dispatch(getCmdSetChat(chats))
      return chats
   } catch (err) {
      console.log('Cannot load chats', err)
      throw err
   } finally {
      store.dispatch({ type: SET_LOADING, isLoading: false })
   }
}

export async function loadAllChats() {
   store.dispatch({ type: SET_LOADING, isLoading: true })
   try {
      const allChats = await chatService.query()
      store.dispatch({ type: SET_ALL_CHATS, allChats })
      return allChats
   } catch (err) {
      console.log('Cannot load all chats', err)
      throw err
   } finally {
      store.dispatch({ type: SET_LOADING, isLoading: false })
   }
}

export async function removeChat(chatId) {
   try {
      await chatService.remove(chatId)
      store.dispatch(getCmdRemoveChat(chatId))
   } catch (err) {
      console.log('Cannot remove chat', err)
      throw err
   }
}

export async function addChat(chat) {
   store.dispatch({ type: SET_LOADING, isLoading: true })
   try {
      const savedChat = await chatService.save(chat)
      store.dispatch(getCmdAddChat(savedChat))
      return savedChat
   } catch (err) {
      console.log('Cannot add chat', err)
      throw err
   } finally {
      store.dispatch({ type: SET_LOADING, isLoading: false })
   }
}

export async function updateChat(chat) {
   try {
      const savedChat = await chatService.save(chat)
      store.dispatch(getCmdUpdateChat(savedChat))
   } catch (err) {
      console.log('Cannot save chat', err)
      throw err
   }
}

export async function setFilter(filterBy) {
   try {
      store.dispatch({ type: SET_FILTER, filterBy })
   } catch (err) {
      console.log('Cannot set filter', err)
   }
}

// Command Creators:
function getCmdSetChat(chats) {
   return {
      type: SET_CHAT,
      chats,
   }
}
function getCmdRemoveChat(chatId) {
   return {
      type: REMOVE_CHAT,
      chatId,
   }
}
function getCmdAddChat(chat) {
   return {
      type: ADD_CHAT,
      chat,
   }
}
function getCmdUpdateChat(chat) {
   return {
      type: UPDATE_CHAT,
      chat,
   }
}

// unitTestActions()
async function unitTestActions() {
   await loadChats()
   await addChat(chatService.getEmptyChat())
   await updateChat({
      _id: 'm1oC7',
      title: 'Chat-Good',
   })
   await removeChat('m1oC7')
   // TODO unit test addChatMsg
}
