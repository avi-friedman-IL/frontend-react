import { msgService } from '../../services/msg'
import { store } from '../store'
import {
   ADD_MSG,
   REMOVE_MSG,
   SET_MSG,
   UPDATE_MSG,
   SET_FILTER,
   SET_LOADING,
} from '../reducers/msg.reducer'

export async function loadMsgs(filterBy = {}) {
   store.dispatch({ type: SET_LOADING, isLoading: true })
   try {
      const msgs = await msgService.query(filterBy)
      store.dispatch(getCmdSetMsg(msgs))
      return msgs
   } catch (err) {
      console.log('Cannot load msgs', err)
      throw err
   } finally {
      store.dispatch({ type: SET_LOADING, isLoading: false })
   }
}

export async function removeMsg(msgId) {
   try {
      await msgService.remove(msgId)
      store.dispatch(getCmdRemoveMsg(msgId))
   } catch (err) {
      console.log('Cannot remove msg', err)
      throw err
   }
}

export async function addMsg(msg) {
   store.dispatch({ type: SET_LOADING, isLoading: true })
   try {
      const savedMsg = await msgService.add(msg)
      store.dispatch(getCmdAddMsg(savedMsg))
      return savedMsg
   } catch (err) {
      console.log('Cannot add msg', err)
      throw err
   } finally {
      store.dispatch({ type: SET_LOADING, isLoading: false })
   }
}

export async function updateMsg(msg) {
   try {
      const savedMsg = await msgService.update(msg)
      store.dispatch(getCmdUpdateMsg(savedMsg))
   } catch (err) {
      console.log('Cannot save msg', err)
      throw err
   }
}

export async function setFilter(filterBy) {
   store.dispatch({ type: SET_FILTER, filterBy })
}

// Command Creators:
function getCmdSetMsg(msgs) {
   return {
      type: SET_MSG,
      msgs,
   }
}
function getCmdRemoveMsg(msgId) {
   return {
      type: REMOVE_MSG,
      msgId,
   }
}
function getCmdAddMsg(msg) {
   return {
      type: ADD_MSG,
      msg,
   }
}
function getCmdUpdateMsg(msg) {
   return {
      type: UPDATE_MSG,
      msg,
   }
}