import { UserList } from '../cmps/UserList.jsx'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import {
   loadUsers,
   removeUser,
   updateUser,
} from '../store/actions/user.actions.js'
import { AddUser } from '../cmps/AddUser.jsx'
import { t } from 'i18next'

export function UserIndex() {
   const users = useSelector(store => store.userModule.users)
   const [isOpenAddUser, setIsOpenAddUser] = useState(false)
   async function loadCmp() {
      try {
         await loadUsers()
      } catch (err) {
         console.log('err', err)
      }
   }

   async function onRemoveUser(userId) {
      if (confirm(t('delete?'))) {
         try {
            await removeUser(userId)
         } catch (err) {
            console.log('err', err)
         }
      }
   }

   async function onUpdateUser(user) {
      try {
         await updateUser(user)
      } catch (err) {
         console.log('err', err)
      }
   }
   useEffect(() => {
      loadCmp()
   }, [users?.length])
   return (
      <section className='user-index'>
         <button
            className='add-btn btn3'
            onClick={() => setIsOpenAddUser(true)}>
            {t('Add user')}
         </button>
         <UserList
            users={users}
            onRemoveUser={onRemoveUser}
            onUpdateUser={onUpdateUser}
         />
         {isOpenAddUser && <AddUser setIsOpenAddUser={setIsOpenAddUser} />}
      </section>
   )
}
