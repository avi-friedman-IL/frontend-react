import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { socketService } from '../services/socket.service'
import { t } from 'i18next'

export function ContactsPreview({ contact, userId }) {
   const allChats = useSelector(state => state.chatModule.allChats)
   const typing = useSelector(state => state.userModule.typing)
   const [newMsgs, setNewMsgs] = useState([])
   const [dataTyping, setDataTyping] = useState(null)

   useEffect(() => {
      const unreadMsgs = allChats.filter(
         chat =>
            chat.fromUserId === contact._id &&
            chat.toUserId === userId &&
            !chat.isRead
      )
      setNewMsgs(unreadMsgs)
   }, [allChats?.length])

   useEffect(() => {
      socketService.setup()
      socketService.on('typing', onTyping)
      socketService.on('offTyping', offTyping)
      return () => {
         socketService.off('typing', onTyping)
         socketService.off('offTyping', offTyping)
      }
   }, [dataTyping])

   function onTyping(data) {
      if (data.toUserId === userId && data.fromUserId === contact._id) {
         setDataTyping(data)
      }
   }

   function offTyping() {
      setDataTyping(null)
   }

   const isTyping = dataTyping?.fromUserId === contact._id && dataTyping?.toUserId === userId

   // const isTyping =
   //    typing?.fromUserId === contact._id && typing?.toUserId === userId
   return (
      <>
         <img className='img-url' src={contact.imgUrl} alt={contact.fullname} />
         <p>{contact.fullname}</p>
         {newMsgs?.length > 0 && (
            <span className='unread-msgs'>{newMsgs.length}</span>
         )}
         {isTyping && <span className='typing'>{t('typing...')}</span>}
      </>
   )
}
