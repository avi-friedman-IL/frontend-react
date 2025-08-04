import { useState } from 'react'
import { t } from 'i18next'
import { MdClose } from 'react-icons/md'

export function UserEdit({ user, onUpdateUser, setIsOpenEditUser }) {
   const [currUser, setCurrUser] = useState({ 
      ...user, 
      gender: user.gender || 'male'
   })
   
   function handleChange(ev) {
      const field = ev.target.name
      setCurrUser({ ...currUser, [field]: ev.target.value })
   }
   
   async function handleSave(ev) {
      ev.preventDefault()
      setIsOpenEditUser(false)
      await onUpdateUser(currUser)
   }

   return (
      <form className='user-edit'>
         <label htmlFor='fullname'>{t('fullname')}</label>
         <input
            type='text'
            name='fullname'
            value={currUser.fullname || ''}
            onChange={handleChange}
         />
         <label htmlFor='username'>{t('username')}</label>
         <input
            type='text'
            name='username'
            value={currUser.username || ''}
            onChange={handleChange}
         />
         <label htmlFor='password'>{t('password')}</label>
         <input
            type='text'
            name='password'
            value={currUser.password || ''}
            onChange={handleChange}
         />
         
         <label htmlFor='gender'>{t('Gender')}</label>
         <select
            name='gender'
            id='gender'
            value={currUser.gender || ''}
            onChange={handleChange}
            className="select"
            required
         >
            <option value="">{t('Select Gender')}</option>
            <option value="male">{t('male')}</option>
            <option value="female">{t('female')}</option>
         </select>
         
         <button className='save-btn btn3' onClick={handleSave}>
            {t('save')}
         </button>
         <button type='button' className='close-btn' onClick={() => setIsOpenEditUser(false)}>
            <MdClose />
         </button>
      </form>
   )
}
