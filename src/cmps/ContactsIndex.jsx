import { useSelector } from 'react-redux'
import { ContactsList } from './ContactsList'
import { useEffect, useRef, useState } from 'react'
import { setFilter } from '../store/actions/chat.actions'
import { loadUsers } from '../store/actions/user.actions'
import { CreateGroup } from './CreateGroup.jsx'
import { GroupList } from './GroupList.jsx'
import { t } from 'i18next'
import { RiChatNewLine } from 'react-icons/ri'
import { Tooltip } from './Tooltip.jsx'

export function ContactsIndex() {
   const user = useSelector(state => state.userModule.user)
   const users = useSelector(state => state.userModule.users)
   const contacts = useSelector(state => state.userModule.user.contacts)

   const [toUserId, setToUserId] = useState(contacts?.[0]?._id)
   const [toGroupId, setToGroupId] = useState(null)
   const [isOpen, setIsOpen] = useState(false)
   const [isTooltipOpen, setIsTooltipOpen] = useState(false)
   const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

   const timeoutRef = useRef(null)

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

   function handleMouseEnter(ev) {
      timeoutRef.current = setTimeout(() => {
         setIsTooltipOpen(true)
      }, 500)
      setTooltipPos({ x: ev.pageX + 10, y: ev.pageY + 10 })
   }

   function handleMouseLeave() {
      clearTimeout(timeoutRef.current)
      setIsTooltipOpen(false)
   }

   if (!contacts) return
   return (
      <section className='contacts-index'>
         {isOpen && (
            <CreateGroup
               user={user}
               users={users}
               contacts={contacts}
               setIsOpen={setIsOpen}
            />
         )}
         <div className='list-header'>
            <h3>{t('groups')}</h3>
            <button
               className='btn2'
               onClick={() => setIsOpen(true)}
               onMouseEnter={handleMouseEnter}
               onMouseLeave={handleMouseLeave}>
               <RiChatNewLine />
            </button>
            {isTooltipOpen && <Tooltip position={tooltipPos} text={t('create group')}/>}
         </div>

         <GroupList
            groups={user.groups}
            toGroupId={toGroupId}
            setToUserId={setToUserId}
            setToGroupId={setToGroupId}
            userId={user._id}
         />
         <div className='list-header'>
            <h3>{t('chats')}</h3>
         </div>
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
