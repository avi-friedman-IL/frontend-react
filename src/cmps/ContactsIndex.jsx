import { useSelector } from 'react-redux'
import { ContactsList } from './ContactsList'
import { useEffect, useState } from 'react'
import { loadChats, setFilter, updateChat } from '../store/actions/chat.actions'
import { useTranslation } from 'react-i18next'
import { loadUsers } from '../store/actions/user.actions'

export function ContactsIndex() {
   const user = useSelector(state => state.userModule.user)
   const contacts = useSelector(state => state.userModule.user.contacts)

   const [toUserId, setToUserId] = useState(contacts?.[0]?._id)
   // const [toUserId, setToUserId] = useState(null)
   const { t } = useTranslation()

   useEffect(() => {
      setFilter({ toUserId: toUserId, fromUserId: user._id } || {})
      load()
   }, [toUserId])

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
         <h3>{t('chats')}</h3>
         <ContactsList
            contacts={contacts}
            toUserId={toUserId}
            setToUserId={setToUserId}
            userId={user._id}
         />
      </section>
   )
}
