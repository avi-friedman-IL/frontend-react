import { t } from 'i18next'
import { ResponseForm } from './ResponseForm'
import { getDayOrDate } from '../services/util.service'
import { MdOutlineReply } from 'react-icons/md'

export function MsgDetails({
   msg,
   users,
   showMsgId,
   isOpenResponse,
   setIsOpenResponse,
   date,
   time,
   loggedInUser,
}) {
   const msgFields = Object.keys(msg)
   const msgFieldsToShow = msgFields.filter(
      key =>
         key !== '_id' &&
         key !== 'createdAt' &&
         key !== 'responses' &&
         key !== 'isDone' &&
         key !== 'subject' &&
         key !== 'from'
   )
   const from = users.find(user => user._id === msg.from)?.fullname || 'Unknown'
   return (
      <div
         className={`msg-details-container ${
            showMsgId === msg._id ? 'open' : ''
         }`}>
         <div className='msg-details'>
            {msgFieldsToShow.map(key => (
               <p key={key}>
                  {t(key)}: {msg[key]}
               </p>
            ))}
         </div>

         {msg.responses?.length > 0 && (
            <div className='msg-details-responses-container grid gap-1'>
               {msg.responses.map(response => (
                  <div className='msg-details-response grid gap-5' key={response.id}>
                     <h3>{t('response')}:</h3>
                     <p>
                        {t('from')}:{response.fromName}
                     </p>
                     <p className='color-pink'>
                        {response.content}
                     </p>
                  </div>
               ))}
            </div>
         )}

         <div className='msg-details-btns'>
            <button
               className='response-btn btn2'
               onClick={ev => {
                  ev.stopPropagation()
                  setIsOpenResponse(true)
               }}>
               {t('Response')}
               <MdOutlineReply />
            </button>
         </div>
         {isOpenResponse && (
            <ResponseForm
               setIsOpenResponse={setIsOpenResponse}
               msg={msg}
               users={users}
            />
         )}
      </div>
   )
}
