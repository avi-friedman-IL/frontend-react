import { ChatPreview } from './ChatPreview.jsx'

export function ChatList({
   chats,
   onRemoveChat,
   setSelectedChatId,
   selectedChatId,
   loggedinUser,
}) {
   return (
      <section className='chat-list'>
         <ul>
            {chats.map(chat => (
               <li
                  key={chat._id}
                  className={`${chat._id === selectedChatId ? 'selected' : ''}`}
                  onClick={() => setSelectedChatId(chat._id)}>
                  <ChatPreview chat={chat} onRemoveChat={onRemoveChat} loggedinUser={loggedinUser} />
               </li>
            ))}
         </ul>
      </section>
   )
}
