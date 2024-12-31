import { chatService } from "../../services/chat"
import { userService } from "../../services/user"

export const SET_CHAT = 'SET_CHAT'
export const REMOVE_CHAT = 'REMOVE_CHAT'
export const ADD_CHAT = 'ADD_CHAT'
export const UPDATE_CHAT = 'UPDATE_CHAT'
export const SET_FILTER = 'SET_FILTER'
export const SET_LOADING = 'SET_LOADING'
export const SET_ALL_CHATS = 'SET_ALL_CHATS'

const initialState = {
   chats: [],
   allChats: [],
   filterBy: {},
   isLoading: false,
   lastChat: null,
}

export function chatReducer(state = initialState, action) {
   var newState = state
   var chats
   switch (action.type) {
      case SET_CHAT:
         newState = { ...state, chats: action.chats }
         break
      case REMOVE_CHAT:
         const lastRemovedChat = state.chats.find(
            chat => chat._id === action.chatId
         )
         chats = state.chats.filter(chat => chat._id !== action.chatId)
         newState = { ...state, chats, lastRemovedChat }
         break
      case ADD_CHAT:
         newState = { ...state, chats: [...state.chats, action.chat] }
         break
      case UPDATE_CHAT:
         chats = state.chats.map(chat =>
            chat._id === action.chat._id ? action.chat : chat
         )
         newState = { ...state, chats }
         break
      case SET_FILTER:
         newState = { ...state, filterBy: action.filterBy }
         break
      case SET_LOADING:
         newState = { ...state, isLoading: action.isLoading }
         break
      case SET_ALL_CHATS:
         newState = { ...state, allChats: action.allChats }
         break
      default:
         state
   }
   return newState
}

// unitTestReducer()

function unitTestReducer() {
   var state = initialState
   const chat1 = {
      _id: 'b101',
      title: 'Chat ' + parseInt(Math.random() * 10),
      msgs: [],
   }
   const chat2 = {
      _id: 'b102',
      title: 'Chat ' + parseInt(Math.random() * 10),
      msgs: [],
   }

   state = chatReducer(state, { type: SET_CHATS, chats: [chat1] })
   console.log('After SET_CHATS:', state)

   state = chatReducer(state, { type: ADD_CHAT, chat: chat2 })
   console.log('After ADD_CHAT:', state)

   state = chatReducer(state, {
      type: UPDATE_CHAT,
      chat: { ...chat2, title: 'Good' },
   })
   console.log('After UPDATE_CHAT:', state)

   state = chatReducer(state, { type: REMOVE_CHAT, chatId: chat2._id })
   console.log('After REMOVE_CHAT:', state)

   const msg = { id: 'm' + parseInt(Math.random() * 100), txt: 'Some msg' }
   state = chatReducer(state, { type: ADD_CHAT_MSG, chatId: chat1._id, msg })
   console.log('After ADD_CHAT_MSG:', state)

   state = chatReducer(state, { type: REMOVE_CHAT, chatId: chat1._id })
   console.log('After REMOVE_CHAT:', state)
}
