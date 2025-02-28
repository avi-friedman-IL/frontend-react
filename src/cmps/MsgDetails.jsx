import { t } from 'i18next'
import { ResponseForm } from './ResponseForm'
import { getDayOrDate } from '../services/util.service'

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
      <div className={`msg-details ${showMsgId === msg._id ? 'open' : ''}`}>
         {msgFieldsToShow.map(key => (
            <p key={key}>
               {t(key)}: {msg[key]}
            </p>
         ))}

         {/* <div className='responses'>
            {msg.responses?.length > 0 && (
               <ul className='responses-container'>
                  <h3>{t('Responses')}</h3>
                  {msg.responses.map((response, idx) => (
                     <li key={response.id} className='response'>
                        <p>
                           {t('From')}:{' '}
                           {users.find(user => user._id === response.from)
                              ?.fullname || 'Unknown'}
                        </p>
                        <p>
                           {t('To')}:{' '}
                           {users.find(user => user._id === response.to)
                              ?.fullname || 'Unknown'}
                        </p>
                        <p className='response-content'>
                           {t('Content')}: {response.content}
                        </p>
                        <p>
                           {t('Date')}: {getDayOrDate(response.createdAt)}
                        </p>
                        <p>
                           {t('Time')}:{' '}
                           {new Date(response.createdAt).toLocaleTimeString(
                              [],
                              {
                                 hour: '2-digit',
                                 minute: '2-digit',
                              }
                           )}
                        </p>
                     </li>
                  ))}
               </ul>
            )}
         </div> */}
         <div className='msg-details-btns'>
            <button
               className='response-btn btn2'
               onClick={ev => {
                  ev.stopPropagation()
                  setIsOpenResponse(true)
               }}>
               {t('Response')}
            </button>
         </div>
         {isOpenResponse && (
            <ResponseForm
               setIsOpenResponse={setIsOpenResponse}
               msg={msg}
               users={users}
               //    loggedInUser={loggedInUser}
            />
         )}
      </div>
   )
}
