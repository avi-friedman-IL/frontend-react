import { useEffect, useState } from 'react'
import { socketService } from '../services/socket.service'
import { showRespectMsg } from '../services/event-bus.service'
import { t } from 'i18next'
import { RespectForm } from './RespectForm'
import { useSelector } from 'react-redux'
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6'
export function RespectBtn() {
   const [isOpenRespectForm, setIsOpenRespectForm] = useState(false)
   const user = useSelector(store => store.userModule.user)
   useEffect(() => {
      if (!socketService.isConnected()) socketService.setup()
      socketService.on('on-respected-msg', onRespectMsg)
      return () => {
         socketService.off('on-respected-msg', onRespectMsg)
      }
   }, [])

   function onRespectMsg({ userName, amount }) {
      return showRespectMsg(
         `${userName} ${t('recruit now')} ${amount} ` + t('Shekel')
      )
   }

   return (
      <section className='respect-btn-container'>
         <RespectForm
            setIsOpenRespectForm={setIsOpenRespectForm}
            isOpenRespectForm={isOpenRespectForm}
         />
         {user && (
            <button
               className='respect-btn btn2'
               onClick={() => setIsOpenRespectForm(!isOpenRespectForm)}>
               <span className='respect-btn-text'>
                  {isOpenRespectForm ? t('Close') : t('Tell friends')}
               </span>
               <span className='respect-btn-icon'>
                  {isOpenRespectForm ? (
                     <FaArrowRightLong />
                  ) : (
                     <FaArrowLeftLong />
                  )}
               </span>
            </button>
         )}
      </section>
   )
}
