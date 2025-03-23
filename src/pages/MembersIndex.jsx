import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadUser, loadUsers, updateLoggedUser } from '../store/actions/user.actions'
import { MembersList } from '../cmps/MembersList'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { t } from 'i18next'

export function MembersIndex() {
   const users = useSelector(state => state.userModule.users)
   const userId = useSelector(state => state.userModule.user._id)
   useEffect(() => {
      load()
   }, [users.length])

   async function load() {
      try {
         await loadUsers()
      } catch (err) {
         console.log('Cannot load users', err)
      }
   }

   async function onAdd(userToAddId) {
      try {
         const { _id, fullname, imgUrl } = await loadUser(userToAddId)
         const loggedUser = await loadUser(userId)
         const updatedUser = {
            ...loggedUser,
            contacts: loggedUser?.contacts?.length
               ? [...loggedUser.contacts, { _id, fullname, imgUrl }]
               : [{ _id, fullname, imgUrl }],
         }
         await updateLoggedUser(updatedUser)
         showSuccessMsg(t('Added to contacts'))
      } catch (err) {
         console.log('Cannot add user', err)
         showErrorMsg(t('Cannot add user'))
      }
   }

   async function onRemove(userToRemoveId) {
      try {
         const loggedUser = await loadUser(userId)
         const updatedUser = {
            ...loggedUser,
            contacts: loggedUser.contacts.filter(
               contact => contact._id !== userToRemoveId
            ),
         }
         await updateLoggedUser(updatedUser)
         showSuccessMsg(t('Deleted from contacts'))
      } catch (err) {
         console.log('Cannot remove user', err)
         showErrorMsg(t('Cannot remove user'))
      }
   }

   return (
      <section className='members-index'>
         <MembersList members={users} onAdd={onAdd} onRemove={onRemove} />
      </section>
   )
}
