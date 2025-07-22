import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { addMsg, loadMsgs, removeMsg, updateMsg } from '../store/actions/msg.actions.js'
import { MsgList } from '../cmps/MsgList.jsx'
import { MsgSidebar } from '../cmps/MsgSidebar.jsx'
import { MsgFilter } from '../cmps/MsgFilter.jsx'
import { loadUsers, updateUser } from '../store/actions/user.actions.js'
import { SOCKET_EVENT_MSG_ADDED, SOCKET_EVENT_MSG_UPDATED, SOCKET_EVENT_USER_UPDATED, socketService } from '../services/socket.service.js'
import { useDispatch } from 'react-redux'
import { t } from 'i18next'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { BsFileEarmarkExcelFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { ADD_MSG, UPDATE_MSG } from '../store/reducers/msg.reducer.js'
import { UPDATE_USER } from '../store/reducers/user.reducer.js'

export function MsgIndex() {
   const dispatch = useDispatch()
   const msgs = useSelector(state => state.msgModule.msgs)
   const users = useSelector(state => state.userModule.users)
   const loggedinUser = useSelector(state => state.userModule.user)
   const filterBy = useSelector(state => state.msgModule.filterBy)

   const [showMsgId, setShowMsgId] = useState(null)
   useEffect(() => {
      if (loggedinUser) {
         load()
      }
   }, [filterBy, loggedinUser])

   useEffect(() => {
      socketService.on(SOCKET_EVENT_MSG_ADDED, (msg) => {
         dispatch({ type: ADD_MSG, msg })
      })
      socketService.on(SOCKET_EVENT_MSG_UPDATED, (msg) => {
         dispatch({ type: UPDATE_MSG, msg })
      })
      socketService.on(SOCKET_EVENT_USER_UPDATED, (user) => {
         dispatch({ type: UPDATE_USER, user })
      })
      return () => {
         socketService.off(SOCKET_EVENT_MSG_ADDED)
         socketService.off(SOCKET_EVENT_MSG_UPDATED)
         socketService.off(SOCKET_EVENT_USER_UPDATED)
      }
   }, [])

   async function load() {
      try {
         const initialFilter = {
            ...filterBy,
            userId: loggedinUser._id,
            isAdmin: loggedinUser.isAdmin,
         }
         await loadMsgs(initialFilter)
         if (!users?.length) await loadUsers()
      } catch (err) {
         console.log('Cannot load messages:', err)
      }
   }

   async function onAddMsg(newMsg) {
      try {
         await addMsg(newMsg)
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
         await updateMsg(updatedMsg)
      } catch {
         console.log('Cannot update msg')
      }
   }

   async function onUpdateUser(userToUpdate) {
      try {
         await updateUser(userToUpdate)
      } catch {
         console.log('Cannot update user')
      }
   }

   function exportToExcel() {
      // הכנת הנתונים לקובץ Excel
      const dataToExport = msgs.map(msg => {
         const msgToExport = {
            ...msg,
            createdAt: new Date(msg.createdAt).toLocaleString(),
            _id: null,
            from: null
         }
         return msgToExport
      })

      // יצירת גיליון עבודה
      const worksheet = XLSX.utils.json_to_sheet(dataToExport)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Messages')

      // יצירת קובץ Excel והורדה
      const excelBuffer = XLSX.write(workbook, {
         bookType: 'xlsx',
         type: 'array',
      })
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
      saveAs(blob, `Messages-${new Date().toLocaleDateString()}.xlsx`)
   }

   if (!msgs) return <div>Loading...</div>
   return (
      <section className='msg-index grid'>
         <MsgFilter msgs={msgs} />
         <MsgSidebar />

         <Link className='add-btn btn1' to='/template'>
            {t('New Message')}
         </Link>

         <MsgList
            msgs={msgs}
            users={users}
            onRemoveMsg={onRemoveMsg}
            onUpdateMsg={onUpdateMsg}
            showMsgId={showMsgId}
            setShowMsgId={setShowMsgId}
            loggedinUser={loggedinUser}
            onUpdateUser={onUpdateUser}
         />

         {loggedinUser?.isAdmin && (
            <button className='export-btn btn1' onClick={exportToExcel}>
               {t('Export to Excel')}
               <BsFileEarmarkExcelFill />
            </button>
         )}
      </section>
   )
}
