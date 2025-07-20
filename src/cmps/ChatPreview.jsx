import { formatChatDate } from '../services/util.service.js'
import { t } from 'i18next'

export function ChatPreview({ chat, onRemoveChat, loggedinUser }) {
   const isGroup = chat.name
   const lastMsg = chat.msgs[chat.msgs.length - 1] || null
   const lastMsgDate = lastMsg ? formatChatDate(lastMsg?.createdAt) : ''
   const unreadMsgs = chat.msgs?.filter(
      msg => msg.fromId !== loggedinUser._id && !msg.isRead
   )?.length

   const unreadMsgsBadge = unreadMsgs ? (
      <span className='unread-msgs-badge'>{unreadMsgs}</span>
   ) : null

   return (
      <article className='chat-preview'>
         <div className='info'>
            {loggedinUser._id === chat.ownerId ? (
               <h3>{chat.to || chat.name}</h3>
            ) : (
               <h3>{chat.name || chat.owner}</h3>
            )}
            <p className='last-msg-date'>{lastMsgDate}</p>
         </div>
         <div className='last-msg'>
            {!isGroup && (
               <p>
                  {lastMsg?.fromId === loggedinUser._id
                     ? t('You') + ': '
                     : ''}
                  {lastMsg?.txt}
                  {!lastMsg?.txt && (
                     <span className='start-chat-with'>
                        {t('Start chat')}
                     </span>
                  )}
               </p>
            )}
            {isGroup && (
               <p>
                  {lastMsg?.fromId === loggedinUser._id
                     ? t('You') + ': '
                     : lastMsg?.from ? lastMsg?.from + ': ' : ''}
                  {lastMsg?.txt}
                  {!lastMsg?.txt && (
                     <span className='start-chat-with'>
                        {t('Start chat with')} {chat.name}
                     </span>
                  )}
               </p>
            )}
            {unreadMsgsBadge}
         </div>
         <div className='btns'>
            {loggedinUser._id === chat.ownerId && (
               <button
                  className='delete-btn'
                  onClick={() => onRemoveChat(chat._id)}>
                  {t('Delete')}
               </button>
            )}
         </div>
      </article>
   )
}
