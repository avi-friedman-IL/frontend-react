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
import { UserFilter } from '../cmps/UserFilter.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

export function UserIndex() {
   const users = useSelector(store => store.userModule.users)
   const filterBy = useSelector(store => store.userModule.filterBy)
   const [isOpenAddUser, setIsOpenAddUser] = useState(false)
   async function loadCmp() {
      try {
         await loadUsers(filterBy)
      } catch (err) {
         console.log('err', err)
      }
   }

   async function onRemoveUser(userId) {
      if (confirm(t('delete?'))) {
         try {
            await removeUser(userId)
            showSuccessMsg(t('user removed'))
         } catch (err) {
            showErrorMsg(t('user removed error'))
            console.log('err', err)
         }
      }
   }

   async function onUpdateUser(user) {
      try {
         await updateUser(user)
         showSuccessMsg(t('user updated'))
      } catch (err) {
         showErrorMsg(t('user updated error'))
         console.log('err', err)
      }
   }
   useEffect(() => {
      loadCmp()
   }, [users?.length, filterBy])
   return (
      <section className='user-index'>
         <UserFilter setIsOpenAddUser={setIsOpenAddUser} />
         <UserList
            users={users}
            onRemoveUser={onRemoveUser}
            onUpdateUser={onUpdateUser}
         />
         {isOpenAddUser && <AddUser setIsOpenAddUser={setIsOpenAddUser} />}
      </section>
   )
}
