import { useSelector } from 'react-redux'
import { ContactsList } from './ContactsList'
import { useEffect, useState } from 'react'
import { setChatFilter } from '../store/actions/chat.actions'
import { setUserFilter } from '../store/actions/user.actions'
import {
   loadUsers,
   updateLoggedUser,
   updateUser,
} from '../store/actions/user.actions'
import { CreateGroup } from './CreateGroup.jsx'
import { GroupList } from './GroupList.jsx'
import { t } from 'i18next'
import { RiChatNewLine } from 'react-icons/ri'
import { socketService } from '../services/socket.service.js'
import { UserFilter } from './UserFilter.jsx'

export function ContactsIndex() {
   const user = useSelector(state => state.userModule.user)
   const users = useSelector(state => state.userModule.users)
   const chatFilter = useSelector(state => state.chatModule.filterBy)
   const userFilter = useSelector(state => state.userModule.filterBy)

   const [toUserId, setToUserId] = useState(null)
   const [toGroupId, setToGroupId] = useState(null)
   const [isOpen, setIsOpen] = useState(false)
   const [isShowGroups, setIsShowGroups] = useState(false)
   const [isShowChats, setIsShowChats] = useState(true)

   useEffect(() => {
      const filter = { isAdmin: user.isAdmin, text: userFilter.text }
      setUserFilter(filter)
      loadUsers(filter)
   }, [userFilter.text])

   useEffect(() => {
      if (toUserId) {
         setChatFilter({
            toUserId: toUserId,
            toGroupId: null,
            fromUserId: user._id,
         })
      }

      if (toGroupId) {
         setChatFilter({
            toUserId: null,
            toGroupId: toGroupId,
            fromUserId: user._id,
         })
      }
   }, [toUserId, toGroupId])

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
               contacts={users}
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
         {isShowChats && <UserFilter cmp='contacts' />}
         {isAuthorizedGroup && (
            <button className='create-btn' onClick={() => setIsOpen(true)}>
               {t('create group')}
               <RiChatNewLine />
            </button>
         )}

         {isShowGroups && (
            <GroupList
               groups={user.groups}
               toGroupId={chatFilter.toGroupId}
               onGroupPicker={onGroupPicker}
               userId={user._id}
               onRemoveGroup={onRemoveGroup}
            />
         )}

         {isShowChats && (
            <ContactsList
               contacts={users}
               toUserId={chatFilter.toUserId}
               userId={user._id}
               onContactPicker={onContactPicker}
            />
         )}
      </section>
   )
}
