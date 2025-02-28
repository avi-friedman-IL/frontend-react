import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {
   addMsg,
   loadMsgs,
   removeMsg,
   updateMsg,
} from '../store/actions/msg.actions.js'
import { MsgList } from '../cmps/MsgList.jsx'
import { NewMsg } from '../cmps/NewMsg.jsx'
import { MsgFilter } from '../cmps/MsgFilter.jsx'
import { loadUsers } from '../store/actions/user.actions.js'
import { socketService } from '../services/socket.service.js'
import { useDispatch } from 'react-redux'
import { ADD_MSG, UPDATE_MSG } from '../store/reducers/msg.reducer.js'
import { t } from 'i18next'
import { UPDATE_USER } from '../store/reducers/user.reducer.js'

export function MsgIndex() {
   const dispatch = useDispatch()
   const msgs = useSelector(state => state.msgModule.msgs)
   const users = useSelector(state => state.userModule.users)
   const loggedinUser = useSelector(state => state.userModule.user)
   const filterBy = useSelector(state => state.msgModule.filterBy)

   const [isOpenNewMsg, setIsOpenNewMsg] = useState(false)
   const [showMsgId, setShowMsgId] = useState(null)
   useEffect(() => {
      load()
   }, [msgs?.length, filterBy])

   useEffect(() => {
      if (!socketService.isConnected()) socketService.setup()
      socketService.on('msg-add', onAddMsg)
      socketService.on('msg-update', onUpdateMsg)
      socketService.on('user-update', onUpdateUser)
      return () => {
         socketService.off('msg-add', onAddMsg)
         socketService.off('msg-update', onUpdateMsg)
         socketService.off('user-update', onUpdateUser)
      }
   }, [])

   async function load() {
      try {
         await loadMsgs(filterBy)
         if (!users?.length) await loadUsers()
      } catch {
         console.log('Cannot load')
      }
   }

   async function onAddMsg(newMsg) {
      try {
         dispatch({ type: ADD_MSG, msg: newMsg })
      } catch (err) {
         console.log('Cannot add msg', err)  
      }
   }

   async function onRemoveMsg(msgId) {
      try {
         await removeMsg(msgId)
      } catch {
         console.log('Cannot remove msg')
      }
   }

   async function onUpdateMsg(updatedMsg) {
      try {
         dispatch({ type: UPDATE_MSG, msg: updatedMsg })
      } catch {
         console.log('Cannot update msg')
      }
   }

   async function onUpdateUser(userToUpdate) {
      try {
         dispatch({ type: UPDATE_USER, user: userToUpdate })
      } catch {
         console.log('Cannot update user')
      }
   }

   if (!msgs) return <div>Loading...</div>
   return (
      <section className='msg-index grid pad-1'>
         <MsgFilter msgs={msgs} />
         {isOpenNewMsg && (
            <NewMsg
               users={users}
               setIsOpenNewMsg={setIsOpenNewMsg}
               loggedinUser={loggedinUser}
            />
         )}
         <MsgList
            msgs={msgs}
            users={users}
            onRemoveMsg={onRemoveMsg}
            onUpdateMsg={onUpdateMsg}
            showMsgId={showMsgId}
            setShowMsgId={setShowMsgId}
            loggedinUser={loggedinUser}
         />
         <button className='add-btn btn1' onClick={() => setIsOpenNewMsg(true)}>
            + {t('New Message')}
         </button>
      </section>
   )
}
