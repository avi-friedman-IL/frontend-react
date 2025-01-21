import { useEffect, useRef } from 'react'
import { ChatPreview } from './ChatPreview'

export function ChatList({ chats, user, users, onRemove, onUpdate }) {
   const endOfMessagesRef = useRef(null)

   useEffect(() => {
      if (endOfMessagesRef.current) {
         endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' })
      }
   }, [chats])

   return (
      <ul className='chat-list'>
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
                  <img
                     className='img-url'
                     src={
                        users.length &&
                        users.find(user => user._id === chat.fromUserId).imgUrl
                     }
                     alt=''
                  />
               )}
            </li>
         ))}
         
         <div ref={endOfMessagesRef} />
      </ul>
   )
}
