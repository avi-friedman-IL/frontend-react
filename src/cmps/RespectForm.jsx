import { t } from 'i18next'
import { useState } from 'react'
import { socketService } from '../services/socket.service'

export function RespectForm({ setIsOpenRespectForm, isOpenRespectForm }) {
   const [userName, setUserName] = useState('')
   const [amount, setAmount] = useState(0)

   

   function handleChange(ev) {
      const { name, value } = ev.target
      if (name === 'name') setUserName(value)
      if (name === 'amount') setAmount(value)
   }

   function onSend(ev) {
      ev.preventDefault()
      // showRespectMsg(
      //    `${userName} ${t('recruit now')} ${amount} ` +
      //    t('Shekel')
      // )
     
      socketService.emit('on-respected-msg', {
         userName,
         amount,
      })
      setIsOpenRespectForm(false)
      setUserName('')
      setAmount(0)
   }

   return (
      <form className={`respect-form ${isOpenRespectForm ? 'open' : ''}`} onSubmit={onSend}>
         <input
            name='name'
            onChange={handleChange}
            value={userName}
            type='text'
            placeholder={t("Recruiter's name")}
            required
         />
         <input
            name='amount'
            onChange={handleChange}
            value={amount ? amount : ''}
            type='number'
            placeholder={t('Donation amount')}
            required
         />
         <div className='form-btns'>
            <button className='btn2'>{t('Send')}</button>
            <button
               className='btn2'
               onClick={() => setIsOpenRespectForm(false)}>
               {t('Cancel')}
            </button>
         </div>
      </form>
   )
}
