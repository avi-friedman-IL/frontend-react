import { useSelector } from 'react-redux'
import { ContactsList } from './ContactsList'
import { useEffect, useState } from 'react'
import { setFilter } from '../store/actions/chat.actions'
import { loadUsers } from '../store/actions/user.actions'
import { CreateGroup } from './CreateGroup.jsx'
import { GroupList } from './GroupList.jsx'

export function ContactsIndex() {
   const user = useSelector(state => state.userModule.user)
   const users = useSelector(state => state.userModule.users)
   const contacts = useSelector(state => state.userModule.user.contacts)

   const [toUserId, setToUserId] = useState(contacts?.[0]?._id)
   const [toGroupId, setToGroupId] = useState(null)
   const [isOpen, setIsOpen] = useState(false)

   useEffect(() => {
      toUserId &&
         setFilter(
            { toUserId: toUserId, toGroupId: null, fromUserId: user._id } || {}
         )

      toGroupId &&
         setFilter(
            { toUserId: null, toGroupId: toGroupId, fromUserId: user._id } || {}
         )

      load()
   }, [toUserId, toGroupId])

   async function load() {
      try {
         await loadUsers()
      } catch (err) {
         console.log('Cannot load users', err)
      }
   }

   if (!contacts) return
   return (
      <section className='contacts-index'>
         <button className='btn' onClick={() => setIsOpen(true)}>
            Create a group
         </button>
         {isOpen && (
            <CreateGroup
               user={user}
               users={users}
               contacts={contacts}
               setIsOpen={setIsOpen}
            />
         )}
         <GroupList
            groups={user.groups}
            toGroupId={toGroupId}
            setToUserId={setToUserId}
            setToGroupId={setToGroupId}
            userId={user._id}
         />
         <ContactsList
            contacts={contacts}
            toUserId={toUserId}
            setToGroupId={setToGroupId}
            setToUserId={setToUserId}
            userId={user._id}
         />
      </section>
   )
}
