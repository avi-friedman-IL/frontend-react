import { t } from 'i18next'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'
export function UserPermissionsEdit({ user, onUpdateUser, setIsOpenPermissions }) {
   const [currUser, setCurrUser] = useState({ ...user })
   function handleChange(ev) {
      const field = ev.target.name
      const value = ev.target.checked
      setCurrUser(prevUser => ({ ...prevUser, [field]: value }))
   }
   async function handleSave(ev) {
      ev.preventDefault()
      setIsOpenPermissions(false)
      await onUpdateUser(currUser)
   }
   return (
      <form className='user-permissions-edit'>
         <h2>{currUser.fullname}</h2>
         <div className='permissions-edit-row'>
            <input
               type='checkbox'
               name='isAdmin'
               checked={currUser.isAdmin}
               onChange={handleChange}
            />
            <label className='permissions-edit-label' htmlFor='isAdmin'>
               {t('isAdmin')}
            </label>
         </div>
         <div className='permissions-edit-row'>
            <input
               type='checkbox'
               name='isTeamManager'
               checked={currUser.isTeamManager}
               onChange={handleChange}
            />
            <label className='permissions-edit-label' htmlFor='isTeamManager'>
               {t('isTeamManager')}
            </label>
         </div>
         <button className='save-btn btn3' onClick={handleSave}>
            {t('save')}
         </button>
         <button
            type='button'
            className='close-btn'
            onClick={() => setIsOpenPermissions(false)}>
            <MdClose />
         </button>
      </form>
   )
}
