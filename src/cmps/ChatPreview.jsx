import { formatTime, getDayOrDate } from '../services/util.service'
import { ChatAction } from './ChatAction'
import { ChatIcons } from './ChatIcons'
import { MdVisibility } from 'react-icons/md' 
import { FiDownload } from 'react-icons/fi'

export function ChatPreview({ chat, user, users, onRemove, onUpdate }) {
   

   const date = getDayOrDate(chat.createdAt)
   const time = formatTime(chat.createdAt)

   const isImage = chat.file && (
      (chat.file.type && chat.file.type.startsWith('image/')) || 
      chat.file.type === 'image'
   )
   
   const isPDF = chat.file && (
      (chat.file.type && chat.file.type === 'application/pdf') || 
      (chat.file.name && chat.file.name.toLowerCase().endsWith('.pdf'))
   )
   
   // יצירת URL להורדה במידה וחסר
   const getDownloadUrl = (url) => {
      if (!url) return '';
      if (url.includes('fl_attachment')) return url;
      return url.replace('/upload/', '/upload/fl_attachment/');
   }
   
   return (
      <section
         className={
            chat.fromUserId === user._id
               ? 'chat-preview-from-me'
               : 'chat-preview'
         }>
         {chat.msg && <p className='msg'>{chat.msg}</p>}

         {chat.file && (
            <div className='file-display'>
               {isImage ? (
                  <div>
                     <a
                        href={chat.file.url}
                        className='file-link'
                        target='_blank'
                        rel='noopener noreferrer'>
                        <img
                           src={chat.file.url}
                           alt={chat.file.name}
                           className='chat-image'
                           onError={e =>
                              console.log('Image load error:', e.target.src, e)
                           }
                        />
                     </a>
                     <div className='file-actions'>
                        {/* <a
                           href={chat.file.url}
                           className='view-btn'
                           target='_blank'
                           rel='noopener noreferrer'>
                           <MdVisibility /> הצג
                        </a> */}
                        <a
                           href={chat.file.downloadUrl || getDownloadUrl(chat.file.url)}
                           className='download-btn'
                           download={chat.file.name}
                           target='_blank'
                           rel='noopener noreferrer'>
                           {/* <FiDownload /> */}
                           הורד
                        </a>
                     </div>
                  </div>
               ) : isPDF ? (
                  <div className='pdf-preview'>
                     <div className='file-name'>
                        {chat.file.name} ({chat.file.size ? (chat.file.size / 1024).toFixed(2) : '0'} KB)
                     </div>
                     <div className='file-actions'>
                        <a
                           href={chat.file.viewUrl || chat.file.url}
                           className='view-btn'
                           target='_blank'
                           rel='noopener noreferrer'>
                           <MdVisibility /> הצג
                        </a>
                        <a
                           href={chat.file.downloadUrl || getDownloadUrl(chat.file.url)}
                           className='download-btn'
                           download={chat.file.name}
                           target='_blank'
                           rel='noopener noreferrer'>
                           {/* <FiDownload /> */}
                            הורד
                        </a>
                     </div>
                  </div>
               ) : (
                  <div className='file-preview'>
                     <div className='file-name'>
                        {chat.file.name} ({chat.file.size ? (chat.file.size / 1024).toFixed(2) : '0'} KB)
                     </div>
                     <div className='file-actions'>
                        {/* <a
                           href={chat.file.viewUrl || chat.file.url}
                           className='view-btn'
                           target='_blank'
                           rel='noopener noreferrer'>
                           <MdVisibility /> הצג
                        </a> */}
                        <a
                           href={chat.file.downloadUrl || getDownloadUrl(chat.file.url)}
                           className='download-btn'
                           download={chat.file.name}
                           target='_blank'
                           rel='noopener noreferrer'>
                           {/* <FiDownload />  */}
                           הורד
                        </a>
                     </div>
                  </div>
               )}
            </div>
         )}
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
