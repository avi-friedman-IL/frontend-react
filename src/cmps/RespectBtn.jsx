import { useEffect, useState } from 'react'
import { socketService } from '../services/socket.service'
import { showRespectMsg } from '../services/event-bus.service'
import { t } from 'i18next'
import { RespectForm } from './RespectForm'

export function RespectBtn() {
   const [isOpenRespectForm, setIsOpenRespectForm] = useState(false)
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
      <>
         <button
            className='respect-btn btn1'
            onClick={() => setIsOpenRespectForm(true)}>
            {t('Tell friends')}
         </button>
         {isOpenRespectForm && (
            <RespectForm setIsOpenRespectForm={setIsOpenRespectForm} />
         )}
      </>
   )
}
