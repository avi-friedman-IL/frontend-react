import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { socketService } from '../services/socket.service'
import { IoIosContacts } from 'react-icons/io'
import { MdGroup } from 'react-icons/md'

export function GroupPreview({ group, userId }) {
   const { t } = useTranslation()
   const [dataTyping, setDataTyping] = useState(null)
   const [isTyping, setIsTyping] = useState(false)
   const [theMemberTyping, setTheMemberTyping] = useState(null)

   useEffect(() => {
      if (!socketService.isConnected()) socketService.setup()
      socketService.on('typing', onTyping)
      socketService.on('offTyping', offTyping)
      return () => {
         socketService.off('typing', onTyping)
         socketService.off('offTyping', offTyping)
         // socketService.terminate()
      }
   }, [dataTyping])

   function onTyping(data) {
      if (data.toGroupId === group.id && data.fromUserId !== userId) {
         setDataTyping(data)
         setIsTyping(true)

         const memberTyping = group.members.find(
            member => member._id === data.fromUserId
         )
         setTheMemberTyping(memberTyping.fullname)
         console.log('theMemberTyping:', theMemberTyping)
      }
   }

   function offTyping() {
      setDataTyping(null)
      setIsTyping(false)
      setTheMemberTyping(null)
   }

   return (
      <>
         {group.imgUrl ? (
            <img className='user-img' src={group.imgUrl} alt='' />
         ) : (
            <span className='user-img'>
               {/* <IoIosContacts /> */}
               {/* <MdGroup /> */}
               {group.name.charAt(0).toUpperCase()}
            </span>
         )}
         <h4>{group.name}</h4>
         <p>
            {t('members')}: {group.members.length}
         </p>
         {isTyping && (
            <span className='typing'>
               {theMemberTyping} {t('typing...')}
            </span>
         )}
      </>
   )
}
