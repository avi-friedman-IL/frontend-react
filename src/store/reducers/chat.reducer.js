export const SET_CHATS = 'SET_CHATS'
export const ADD_CHAT = 'ADD_CHAT'
export const UPDATE_CHAT = 'UPDATE_CHAT'
export const DELETE_CHAT = 'DELETE_CHAT'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_SELECTED_CHAT = 'SET_SELECTED_CHAT'
export const IS_LOADING = 'IS_LOADING'

const initialState = {
   chats: [],
   filterBy: null,
   selectedChat: null,
   isLoading: false,
}

export function chatReducer(state = initialState, action) {
   switch (action.type) {
      case SET_CHATS:
         return { ...state, chats: action.chats }
      case ADD_CHAT:
         return { ...state, chats: [...state.chats, action.chat] }
      case UPDATE_CHAT:
         return {
            ...state,
            chats: state.chats.map(chat =>
               chat._id === action.chat._id ? action.chat : chat
            ),
            selectedChat: state.selectedChat?._id === action.chat._id ? action.chat : state.selectedChat,
         }
      case DELETE_CHAT:
         return {
            ...state,
            chats: state.chats.filter(chat => chat._id !== action.chatId),
         }
      case SET_FILTER_BY:
         return { ...state, filterBy: action.filterBy }
      case SET_SELECTED_CHAT:
         return {
            ...state,
            selectedChat: state.chats.find(chat => chat._id === action.chatId),
         }
      case IS_LOADING:
         return { ...state, isLoading: action.isLoading }
      default:
         return state
   }
}
