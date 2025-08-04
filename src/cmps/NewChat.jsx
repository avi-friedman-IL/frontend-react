import { useState } from 'react'
import { t } from 'i18next'

export function NewChat({
   users,
   onAddChat,
   onAddGroup,
   setIsNewChatOpen,
   loggedinUser,
}) {
   const [isNewGroup, setIsNewGroup] = useState(false)
   const [groupUsers, setGroupUsers] = useState([])
   const [groupName, setGroupName] = useState('')

   async function handleChange(ev) {
      const toId = ev.target.value
      onAddChat(toId)
   }

   function handleNewGroup(ev) {
      setIsNewGroup(ev.target.checked)
   }

   function handleChangeUserIds(ev) {
      const { checked, dataset } = ev.target
      if (checked) {
         setGroupUsers(prev => [
            ...prev,
            { _id: dataset.userId, fullname: dataset.userName },
         ])
         console.log(groupUsers)
      } else {
         setGroupUsers(prev => prev.filter(user => user._id !== dataset.userId))
         console.log(groupUsers)
      }
   }

   function handleNewGroupName(ev) {
      setGroupName(ev.target.value)
   }

   async function handleSubmit(ev) {
      ev.preventDefault()
      const group = {
         name: groupName,
         groupUsers: groupUsers,
      }
      onAddGroup(group)
      setIsNewChatOpen(false)
   }

   return (
      <form className='new-chat-form'>
         {(loggedinUser.isAdmin || loggedinUser.isTeamManager) && (
            <div className='new-group-checkbox'>
               <input
                  onChange={handleNewGroup}
                  type='checkbox'
                  name='isNewGroup'
               />
               <label htmlFor='isNewGroup'>{t('New Group')}</label>
            </div>
         )}
         {isNewGroup && (
            <input
               className='input'
               onChange={handleNewGroupName}
               type='text'
               name='groupName'
               placeholder={t('Group Name')}
            />
         )}
         <h3>{t('Select a user')}</h3>
         {!isNewGroup && (
            <div className='radio-container'>
               {users.map(user => (
                  <div className='user-radio' key={user._id}>
                     <input
                        onChange={handleChange}
                        type='radio'
                        id={user._id}
                        name='toId'
                        value={user._id}
                     />
                     <label htmlFor={user._id}>{user.fullname}</label>
                  </div>
               ))}
            </div>
         )}

         {isNewGroup && (
            <div className='new-group-container'>
               <div className='checkbox-container'>
                  {users.map(user => (
                     <div className='user-checkbox' key={user._id}>
                        <input
                           className='checkbox'
                           onChange={handleChangeUserIds}
                           type='checkbox'
                           name='userIds'
                           checked={groupUsers.some(
                              currentUser => currentUser._id === user._id
                           )}
                           data-user-name={user.fullname}
                           data-user-id={user._id}
                        />
                        <label htmlFor={user._id}>{user.fullname}</label>
                     </div>
                  ))}
               </div>
            </div>
         )}
         {isNewGroup && (
            <button
               className='new-chat-btn'
               onClick={handleSubmit}
               type='submit'>
               {t('Create Group')}
            </button>
         )}
         <button
            type='button'
            className='new-chat-btn'
            onClick={() => setIsNewChatOpen(false)}>
            {t('Close')}
         </button>
      </form>
   )
}
