import { t } from 'i18next'
import { makeId } from '../services/util.service'
import { useState } from 'react'
import { socketService } from '../services/socket.service'
import { useSelector } from 'react-redux'

export function ResponseForm({
   setIsOpenResponse,
   msg,
   users,
   //  loggedInUser
}) {
   const loggedInUser = useSelector(state => state.userModule.user)
   const [response, setResponse] = useState({
      id: makeId(),
      from: loggedInUser?._id,
      to: msg.from === loggedInUser?._id ? msg.to : msg.from,
      content: '',
      createdAt: Date.now(),
   })
   function handleChange(ev) {
      const value = ev.target.value
      setResponse({ ...response, content: value })
   }

   async function onSend(ev) {
      ev.preventDefault()
      ev.stopPropagation()

      const updatedMsg = { ...msg, responses: [...msg.responses, response] }
      socketService.emit('msg-update', updatedMsg)
      setIsOpenResponse(false)
   }
   return (
      <form className='response-form'>
         <textarea
            className='response-textarea'
            cols={30}
            rows={10}
            onClick={ev => ev.stopPropagation()}
            onChange={handleChange}
            placeholder='Your response here'></textarea>
         <div className='form-btns pad-1 grid-col gap-1'>
            <button className='btn1' onClick={onSend}>
               {t('Send')}
            </button>
            <button
               className='btn1'
               onClick={ev => {
                  ev.stopPropagation()
                  setIsOpenResponse(false)
               }}>
               {t('Cancel')}
            </button>
         </div>
      </form>
   )
}
