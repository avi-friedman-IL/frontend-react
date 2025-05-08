import { useEffect, useRef } from 'react'
import { ChatPreview } from './ChatPreview'

export function ChatList({ chats, user, users, onRemove, onUpdate, filterBy }) {
   const endOfMessagesRef = useRef(null)

   useEffect(() => {
      if (endOfMessagesRef.current) {
         endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' })
      }
   }, [chats.length])

   if (!filterBy?.toUserId && !filterBy?.toGroupId) return
   return (
      <ul className='chat-list'>
         {chats.length === 0 && (
            <img
               className='logo'
               src='https://res.cloudinary.com/dcymxvtnd/image/upload/v1740566743/phherpui8pthmojx02k1.png'
               alt='logo'
            />
         )}
         {chats.map((chat, idx) => (
            <li
               className={
                  chat.fromUserId === user._id
                     ? 'chat-container-from-me'
                     : 'chat-container'
               }
               key={idx}>
               <ChatPreview
                  chat={chat}
                  user={user}
                  users={users}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
               />
               {chat.fromUserId !== user._id && (
                  <span
                     className='user-img'
                     style={{
                        backgroundColor:
                           users.length &&
                           users.find(user => user._id === chat.fromUserId)
                              .color,
                     }}>
                     {users.length &&
                        users
                           .find(user => user._id === chat.fromUserId)
                           .fullname.split(' ')[0]
                           .charAt(0)
                           .toUpperCase()}
                  </span>
               )}
            </li>
         ))}

         <div ref={endOfMessagesRef} />
      </ul>
   )
}
