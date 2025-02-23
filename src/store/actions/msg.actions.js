import { msgService } from '../../services/msg'
import { store } from '../store'
import {
   ADD_MSG,
   REMOVE_MSG,
   SET_MSG,
   UPDATE_MSG,
   SET_FILTER,
   SET_LOADING,
   SET_ALL_MSGS,
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

export async function loadAllMsgs() {
   store.dispatch({ type: SET_LOADING, isLoading: true })
   try {
      const allMsgs = await msgService.query()
      store.dispatch({ type: SET_ALL_MSGS, allMsgs })
      return allMsgs
   } catch (err) {
      console.log('Cannot load all msgs', err)
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
      const savedMsg = await msgService.save(msg)
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
      const savedMsg = await msgService.save(msg)
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

// unitTestActions()
async function unitTestActions() {
   await loadMsgs()
   await addMsg(msgService.getEmptyMsg())
   await updateMsg({
      _id: 'm1oC7',
      title: 'Msg-Good',
   })
   await removeMsg('m1oC7')
   // TODO unit test addMsgMsg
}
