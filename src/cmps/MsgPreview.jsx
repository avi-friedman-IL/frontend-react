import { useState } from 'react'
import { socketService } from '../services/socket.service'
import { t } from 'i18next'
import { MdDelete, MdDoNotDisturb, MdOutlineDone } from 'react-icons/md'
import { getDayOrDate, makeId } from '../services/util.service'
import { MsgDetails } from './MsgDetails.jsx'

export function MsgPreview({
   msg,
   users,
   onRemoveMsg,
   onUpdateMsg,
   showMsgId,
   setShowMsgId,
   loggedInUser,
}) {
   const [currMsg, setCurrMsg] = useState({ ...msg })
   const [isOpenResponse, setIsOpenResponse] = useState(false)
   function formatTime() {
      return new Date(msg.createdAt).toLocaleTimeString([], {
         hour: '2-digit',
         minute: '2-digit',
      })
   }
   function handleChange(ev) {
      const field = ev.target.name
      const value =
         ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value
      setCurrMsg({ ...currMsg, [field]: value })
      
      socketService.emit('msg-update', currMsg)
      const userToUpdate = users.find(user => user._id === msg.from)
      var updatedUser

      if (field === 'isDone' && value === false) {
         updatedUser = {
            ...userToUpdate,
            notifications: userToUpdate.notifications
               ? [
                    ...userToUpdate.notifications,
                    {
                       msgId: msg._id,
                       id: makeId(),
                       subject: msg.subject,
                       text: `Your request in subject has been processed`,
                    },
                 ]
               : [
                    {
                       msgId: msg._id,
                       id: makeId(),
                       subject: msg.subject,
                       text: `Your request in subject has been processed`,
                    },
                 ],
         }
         socketService.emit('user-update', updatedUser)
      } else if (field === 'isDone' && value === true) {
         updatedUser = {
            ...userToUpdate,
            notifications: userToUpdate.notifications.filter(
               notification => notification.msgId !== msg._id
            ),
         }
         socketService.emit('user-update', updatedUser)
      }
   }

   const date = getDayOrDate(msg.createdAt)
   const time = formatTime()

   return (
      <section
         className='msg-preview grid-col align-center pad-5'
         onClick={
            showMsgId === msg._id
               ? () => setShowMsgId(null)
               : () => setShowMsgId(msg._id)
         }>
         <div className='grid-col1'>
            <input
               type='checkbox'
               id={msg._id}
               name='isDone'
               checked={msg.isDone}
               onChange={handleChange}
               onInput={handleChange}
               onClick={ev => ev.stopPropagation()}
            />
            {msg.isDone ? (
               <button className='done-btn btn4'>
                  <MdOutlineDone />
               </button>
            ) : (
               <button className='undone-btn btn4'>
                  <MdDoNotDisturb />
               </button>
            )}
            <p className='from'>
               {users.find(user => user._id === msg.from)?.fullname ||
                  'Unknown'}{' '}
               {msg.responses?.length > 0 && (
                  <span>{msg.responses.length + 1}</span>
               )}
            </p>
         </div>
         <p className='subject'>{t(msg.subject)}</p>
         <p className='content'>{msg.content}</p>
         <div className='msg-actions grid-col'>
            <button className='btn3' onClick={() => onRemoveMsg(msg._id)}>
               <span>{t('Delete')}</span>
               <MdDelete />
            </button>
         </div>
         <div className='msg-info'>
            <span className='date'>{date}, </span>
            <span className='time'>{time}</span>
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
         />
      </section>
   )
}
