import { useEffect, useState } from 'react'
import { socketService } from '../services/socket.service'
import { t } from 'i18next'
import { MdDelete, MdDoNotDisturb, MdOutlineDone } from 'react-icons/md'
import { getDayOrDate, makeId } from '../services/util.service'
import { MsgDetails } from './MsgDetails.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'

export function MsgPreview({
   msg,
   users,
   onRemoveMsg,
   onUpdateMsg,
   showMsgId,
   setShowMsgId,
   loggedInUser,
   onUpdateUser,
}) {
   const [currMsg, setCurrMsg] = useState({ ...msg })
   const [isOpenResponse, setIsOpenResponse] = useState(false)
   const [isCheckedDone, setIsCheckedDone] = useState(msg.isDone)

   useEffect(() => {
      setCurrMsg({ ...msg })
      setIsCheckedDone(msg.isDone)
   }, [msg])

   function formatTime() {
      return new Date(msg.createdAt).toLocaleTimeString([], {
         hour: '2-digit',
         minute: '2-digit',
      })
   }
   async function handleCheckboxChange(ev) {
      const { name, checked } = ev.target
      const updatedMsg = { ...currMsg, [name]: checked }
      setCurrMsg(updatedMsg)
      setIsCheckedDone(checked)
      try {
         await onUpdateMsg(updatedMsg)
      } catch (err) {
         console.log('Cannot update msg', err)
         showErrorMsg(t('Cannot update msg'))
      }
      handleUserUpdate(checked)
   }

   async function handleUserUpdate(checked) {
      const userToUpdate = users.find(user => user._id === msg.from)
      let updatedUser
      if (!userToUpdate) return
      if (!checked) {
         updatedUser = {
            ...userToUpdate,
            notifications:
               userToUpdate?.notifications?.filter(
                  notification => notification.msgId !== msg._id
               ) || [],
         }
      } else {
         const newNotification = {
            msgId: msg._id,
            id: makeId(),
            subject: msg.subject,
            text: t('Your request has been answered'),
         }
         
         updatedUser = {
            ...userToUpdate,
            notifications: userToUpdate?.notifications
               ? [...userToUpdate.notifications, newNotification]
               : [newNotification],
         }
      }
      try {
         await onUpdateUser(updatedUser)
      } catch (err) {
         console.log('Cannot update user', err)
         showErrorMsg(t('Cannot update user'))
      }
   }

   const date = getDayOrDate(msg.createdAt)
   const time = formatTime()

   return (
      <section
         className='msg-preview'
         onClick={() => setShowMsgId(showMsgId === msg._id ? null : msg._id)}>
         <div className='grid-col1'>
            <input
               type='checkbox'
               id={msg._id}
               name='isDone'
               checked={isCheckedDone}
               onChange={handleCheckboxChange}
               onClick={ev => ev.stopPropagation()}
            />
            {isCheckedDone ? (
               <button className='done-btn' title={t('Mark as undone')}>
                  <MdOutlineDone />
               </button>
            ) : (
               <button className='undone-btn' title={t('Mark as done')}>
                  <MdDoNotDisturb />
               </button>
            )}
         </div>

         <p className='from'>
            {msg.fromName || t('Unknown')}
            {msg.responses?.length > 0 && (
               <span>{msg.responses.length + 1}</span>
            )}
         </p>

         <div className='msg-content'>
            <p className='subject'>{t(msg.subject)}</p>
            <p className='content'>{msg.content}</p>
         </div>

         <button
            className='remove-btn'
            onClick={ev => {
               ev.stopPropagation()
               onRemoveMsg(msg._id)
            }}
            title={t('Delete message')}>
            <span>{t('Delete')}</span>
            <MdDelete />
         </button>

         <div className='msg-info'>
            <span className='date'>{date}</span>
            <span className='time'>, {time}</span>
         </div>

         <MsgDetails
            msg={msg}
            users={users}
            showMsgId={showMsgId}
            isOpenResponse={isOpenResponse}
            setIsOpenResponse={setIsOpenResponse}
            date={date}
            time={time}
            loggedInUser={loggedInUser}
            onUpdateMsg={onUpdateMsg}
            onUpdateUser={onUpdateUser}
         />
      </section>
   )
}
