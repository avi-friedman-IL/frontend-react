import { t } from 'i18next'
import { useState } from 'react'
import { UserPermissionsEdit } from './UserPermissionsEdit.jsx'
import { UserEdit } from './UserEdit.jsx'

export function UserPreview({ user, onRemoveUser, onUpdateUser }) {
   const [isOpenPermissions, setIsOpenPermissions] = useState(false)
   const [isOpenEditUser, setIsOpenEditUser] = useState(false)
   
   return (
      <>
         <section className='user-preview pad-1'>
            <div className='user-info'>
               <p className='fullname'>{user.fullname}</p>
               <p className='gender'>
                  <span className='gender-label'>{t('Gender')}:</span>
                  <span className='gender-value'>{t(user.gender || 'male')}</span>
               </p>
            </div>
            <div className='user-type'>
               {user.isAdmin && <p className='admin'>{t('admin')}</p>}
               {user.isTeamManager && (
                  <p className='team-manager'>{t('team manager')}</p>
               )}
               {!user.isAdmin && !user.isTeamManager && (
                  <p className='user'>{t('user')}</p>
               )}
            </div>
            <div className='user-actions'>
               <button
                  className='edit-btn'
                  onClick={() => setIsOpenPermissions(true)}>
                  {t('edit permissions')}
               </button>
               <button
                  className='edit-btn'
                  onClick={() => setIsOpenEditUser(true)}>
                  {t('edit user')}
               </button>
            </div>
            <button
               className='remove-btn'
               onClick={() => onRemoveUser(user._id)}>
               {t('delete')}
            </button>
         </section>
         {isOpenPermissions && (
            <UserPermissionsEdit
               user={user}
               onUpdateUser={onUpdateUser}
               setIsOpenPermissions={setIsOpenPermissions}
            />
         )}
         {isOpenEditUser && (
            <UserEdit
               user={user}
               onUpdateUser={onUpdateUser}
               setIsOpenEditUser={setIsOpenEditUser}
            />
         )}
      </>
   )
}
