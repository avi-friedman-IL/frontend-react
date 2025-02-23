import { useState } from 'react'
import { msgService } from '../services/msg'
import { t } from 'i18next'
import { socketService } from '../services/socket.service'

export function NewMsg({ users, loggedinUser, setIsOpenNewMsg }) {
   const [msg, setMsg] = useState(msgService.getEmptyMsg)

   function handleChange(ev) {
      const field = ev.target.name
      const value = ev.target.value
      setMsg({
         ...msg,
         [field]: value,
         from: loggedinUser._id,
      })
   }

   async function onAddMsg(ev) {
      ev.preventDefault()
      const newMsg = { ...msg, createdAt: Date.now() }
      setIsOpenNewMsg(false)
      try {
         socketService.emit('msg-add', newMsg)
      } catch (err) {
         console.log('err:', err)
      }
   }

   return (
      <form className='new-msg-form form1' onSubmit={onAddMsg}>
         <select name='to' id='to' onChange={handleChange} required>
            <option value=''>{t('To')}:</option>
            {users.map(user => (
               <option key={user._id} value={user._id}>
                  {user.fullname}
               </option>
            ))}
         </select>

         <select name='subject' id='subject' onChange={handleChange} required>
            <option value=''>{t('Subject')}:</option>
            <option value='general'>{t('General')}</option>
            <option value='urgent'>{t('Urgent')}</option>
            <option value='personal'>{t('Personal')}</option>
         </select>

         <textarea
            name='content'
            id='content'
            cols='30'
            rows='10'
            placeholder='Type your message here'
            onChange={handleChange}></textarea>
         <div className='form-btns'>
            <button className='btn1'
               // onClick={onAddMsg}
            >{t('send')}</button>
            <button className='btn1' onClick={() => setIsOpenNewMsg(false)}>
               {t('Cancel')}
            </button>
         </div>
      </form>
   )
}
