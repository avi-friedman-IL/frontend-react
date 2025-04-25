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
import { MsgSidebar } from '../cmps/MsgSidebar.jsx'
import { MsgFilter } from '../cmps/MsgFilter.jsx'
import { loadUsers } from '../store/actions/user.actions.js'
import { socketService } from '../services/socket.service.js'
import { useDispatch } from 'react-redux'
import { ADD_MSG, UPDATE_MSG } from '../store/reducers/msg.reducer.js'
import { t } from 'i18next'
import { UPDATE_USER } from '../store/reducers/user.reducer.js'
import { IoMdAdd } from 'react-icons/io'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { BsFileEarmarkExcelFill } from 'react-icons/bs'
import { TemplateIndex } from '../cmps/TemplateIndex.jsx'

export function MsgIndex() {
   const dispatch = useDispatch()
   const msgs = useSelector(state => state.msgModule.msgs)
   const users = useSelector(state => state.userModule.users)
   const loggedinUser = useSelector(state => state.userModule.user)
   const filterBy = useSelector(state => state.msgModule.filterBy)

   const [isOpenNewMsg, setIsOpenNewMsg] = useState(false)
   const [showMsgId, setShowMsgId] = useState(null)
   const [isShowTemplate, setIsShowTemplate] = useState(false)
   useEffect(() => {
      if (loggedinUser) {
         load()
      }
   }, [msgs?.length, filterBy, loggedinUser])

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
         const initialFilter = {
            ...filterBy,
            userId: loggedinUser._id,
            isAdmin: loggedinUser.isAdmin
         }
         await loadMsgs(initialFilter)
         if (!users?.length) await loadUsers()
      } catch (err) {
         console.log('Cannot load messages:', err)
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

   function exportToExcel() {
      // הכנת הנתונים לקובץ Excel
      const dataToExport = msgs.map((msg) => ({
         נושא: msg.subject,
         סטטוס: msg.status,
         מאת: users.find((user) => user._id === msg.from)?.fullname || 'לא ידוע',
         תאריך: new Date(msg.createdAt).toLocaleString(),
         [t('collection')]: msg.collection,
         [t('phone')]: msg.phone,
         [t('nowName')]: msg.nowName,
         [t('realName')]: msg.realName,
         [t('realPhone')]: msg.realPhone,
         [t('problem')]: msg.problem,
         [t('comment')]: msg.comment,
         [t('note')]: msg.note,
         
         
         // הוסף כאן עוד שדות לפי הצורך
      }));

      // יצירת גיליון עבודה
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Messages');

      // יצירת קובץ Excel והורדה
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `Messages-${new Date().toLocaleDateString()}.xlsx`);
   }

   if (!msgs) return <div>Loading...</div>
   return (
      <section className='msg-index grid'>
         <MsgFilter msgs={msgs} />
         <MsgSidebar />
         {isShowTemplate && (
            <TemplateIndex setIsShowTemplate={setIsShowTemplate}
            />
         )}
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
         <button className='add-btn btn1' onClick={() => setIsShowTemplate(true)}>
            {t('New Message')}
            <span>
               <IoMdAdd />
            </span>
         </button>
        {loggedinUser?.isAdmin && <button className="export-btn btn1" onClick={exportToExcel}>
            {t('Export to Excel')}
            <BsFileEarmarkExcelFill />
         </button>}
      </section>
   )
}
