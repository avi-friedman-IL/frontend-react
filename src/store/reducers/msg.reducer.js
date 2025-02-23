import { msgService } from "../../services/msg"
import { userService } from "../../services/user"

export const SET_MSG = 'SET_MSG'
export const REMOVE_MSG = 'REMOVE_MSG'
export const ADD_MSG = 'ADD_MSG'
export const UPDATE_MSG = 'UPDATE_MSG'
export const SET_FILTER = 'SET_FILTER'
export const SET_LOADING = 'SET_LOADING'
export const SET_ALL_MSGS = 'SET_ALL_MSGS'

const initialState = {
   msgs: [],
   allMsgs: [],
   filterBy: msgService.getDefaultFilter(),
   isLoading: false,
   lastMsg: null,
}

export function msgReducer(state = initialState, action) {
   var newState = state
   var msgs
   switch (action.type) {
      case SET_MSG:
         newState = { ...state, msgs: action.msgs }
         break
      case REMOVE_MSG:
         const lastRemovedMsg = state.msgs.find(
            msg => msg._id === action.msgId
         )
         msgs = state.msgs.filter(msg => msg._id !== action.msgId)
         newState = { ...state, msgs, lastRemovedMsg }
         break
      case ADD_MSG:
         newState = { ...state, msgs: [...state.msgs, action.msg] }
         break
      case UPDATE_MSG:
         msgs = state.msgs.map(msg =>
            msg._id === action.msg._id ? action.msg : msg
         )
         newState = { ...state, msgs }
         break
      case SET_FILTER:
         newState = { ...state, filterBy: action.filterBy }
         break
      case SET_LOADING:
         newState = { ...state, isLoading: action.isLoading }
         break
      case SET_ALL_MSGS:
         newState = { ...state, allMsgs: action.allMsgs }
         break
      default:
         state
   }
   return newState
}

// unitTestReducer()

function unitTestReducer() {
   var state = initialState
   const msg1 = {
      _id: 'b101',
      title: 'Msg ' + parseInt(Math.random() * 10),
      msgs: [],
   }
   const msg2 = {
      _id: 'b102',
      title: 'Msg ' + parseInt(Math.random() * 10),
      msgs: [],
   }

   state = msgReducer(state, { type: SET_MSGS, msgs: [msg1] })
   console.log('After SET_MSGS:', state)

   state = msgReducer(state, { type: ADD_MSG, msg: msg2 })
   console.log('After ADD_MSG:', state)

   state = msgReducer(state, {
      type: UPDATE_MSG,
      msg: { ...msg2, title: 'Good' },
   })
   console.log('After UPDATE_MSG:', state)

   state = msgReducer(state, { type: REMOVE_MSG, msgId: msg2._id })
   console.log('After REMOVE_MSG:', state)

   const msg = { id: 'm' + parseInt(Math.random() * 100), txt: 'Some msg' }
   state = msgReducer(state, { type: ADD_MSG_MSG, msgId: msg1._id, msg })
   console.log('After ADD_MSG_MSG:', state)

   state = msgReducer(state, { type: REMOVE_MSG, msgId: msg1._id })
   console.log('After REMOVE_MSG:', state)
}
