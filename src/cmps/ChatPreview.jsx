import { getDayOrDate } from '../services/util.service'
import { ChatAction } from './ChatAction'
import { ChatIcons } from './ChatIcons'

export function ChatPreview({ chat, user, users, onRemove, onUpdate }) {
   function formatTime() {
      return new Date(chat.createdAt).toLocaleTimeString([], {
         hour: '2-digit',
         minute: '2-digit',
      })
   }

   const date = getDayOrDate(chat.createdAt)
   const time = formatTime()

   return (
      <section
         className={
            chat.fromUserId === user._id
               ? 'chat-preview-from-me'
               : 'chat-preview'
         }>
         <p className='msg'>{chat.msg}</p>

         <div className='msg-info'>
            <span className='date'>{date}, </span>
            <span className='time'>{time}</span>
         </div>

         <ChatIcons chat={chat} users={users} user={user} onUpdate={onUpdate} />

         <ChatAction
            chat={chat}
            user={user}
            onRemove={onRemove}
            onUpdate={onUpdate}
         />
      </section>
   )
}
