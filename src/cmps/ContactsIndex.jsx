import { useSelector } from 'react-redux'
import { ContactsList } from './ContactsList'
import { useEffect, useRef, useState } from 'react'
import {
   loadAllChats,
   loadChats,
   setFilter,
} from '../store/actions/chat.actions'
import {
   loadUsers,
   updateLoggedUser,
   updateUser,
} from '../store/actions/user.actions'
import { CreateGroup } from './CreateGroup.jsx'
import { GroupList } from './GroupList.jsx'
import { t } from 'i18next'
import { RiChatNewLine } from 'react-icons/ri'
import { Tooltip } from './Tooltip.jsx'
import { socketService } from '../services/socket.service.js'

export function ContactsIndex() {
   const user = useSelector(state => state.userModule.user)
   const users = useSelector(state => state.userModule.users)
   const contacts =
      user.isAdmin || user.isTeamManager
         ? users
         : users.filter(u => u.isAdmin || u.isTeamManager)

   const [toUserId, setToUserId] = useState(null)
   const [toGroupId, setToGroupId] = useState(null)
   const [isOpen, setIsOpen] = useState(false)
   const [isTooltipOpen, setIsTooltipOpen] = useState(false)
   const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
   const [isShowGroups, setIsShowGroups] = useState(false)
   const [isShowChats, setIsShowChats] = useState(true)

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
      return () => {
         setFilter({ toUserId: null, toGroupId: null, fromUserId: user._id })
      }
   }, [toUserId, toGroupId])

   async function load() {
      try {
         if (!users.length) await loadUsers()
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

   function onGroupPicker(groupId) {
      setToUserId(null)
      setToGroupId(groupId)
      socketService.emit('joinGroup', groupId)
   }

   async function onContactPicker(contactId) {
      setToGroupId(null)
      setToUserId(contactId)
      const contact = users.find(user => user._id === contactId)
      const updatedContact = {
         ...contact,
         newMsgs: null,
      }
      await updateUser(updatedContact)
   }

   async function onRemoveGroup(groupId) {
      const group = user.groups.find(group => group._id === groupId)
      const updatedGroups = user.groups.filter(group => group.id !== groupId)
      const updatedUser = { ...user, groups: updatedGroups }
      await updateLoggedUser(updatedUser)
   }

   const isAuthorizedGroup =
      isShowGroups && (user?.isAdmin || user?.isTeamManager)
   const isAuthorizedChats =
      isShowChats && (user?.isAdmin || user?.isTeamManager)
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
         <div className='contacts-header'>
            <button
               className={`select-btn ${isShowGroups ? 'active' : ''}`}
               onClick={() => {
                  setIsShowGroups(true)
                  setIsShowChats(false)
               }}>
               {t('groups')}
            </button>
            <button
               className={`select-btn ${isShowChats ? 'active' : ''}`}
               onClick={() => {
                  setIsShowGroups(false)
                  setIsShowChats(true)
               }}>
               {t('chats')}
            </button>
         </div>
         {isAuthorizedGroup && (
            <button
               className='create-btn'
               onClick={() => setIsOpen(true)}
               onMouseEnter={handleMouseEnter}
               onMouseLeave={handleMouseLeave}>
               {t('create group')}
               <RiChatNewLine />
            </button>
         )}

         {isShowGroups && (
            <GroupList
               groups={user.groups}
               toGroupId={toGroupId}
               onGroupPicker={onGroupPicker}
               userId={user._id}
               onRemoveGroup={onRemoveGroup}
            />
         )}

         {isShowChats && (
            <ContactsList
               contacts={contacts}
               toUserId={toUserId}
               userId={user._id}
               onContactPicker={onContactPicker}
            />
         )}
      </section>
   )
}
