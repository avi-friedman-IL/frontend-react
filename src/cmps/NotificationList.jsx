import { t } from 'i18next'
import { NotificationPreview } from './NotificationPreview.jsx'
import { socketService } from '../services/socket.service.js'
import { useEffect, useState } from 'react'
import { showErrorMsg } from '../services/event-bus.service.js'
export function NotificationList({ users, user }) {
   const [notifications, setNotifications] = useState(null)

   useEffect(() => {
      if (!user) return
      const userToUpdate = users.find(currUser => currUser._id === user._id)
      setNotifications(userToUpdate.notifications)
   }, [user, users])

   async function onClear() {
      const userToUpdate = users.find(currUser => currUser._id === user._id)
      const updatedUser = { ...userToUpdate, notifications: [] }
      try {
         socketService.emit('user-update', updatedUser)
      } catch (err) {
         showErrorMsg('Cannot update user')
         console.log('NotificationList: err in onClear', err)
      }
   }

   if (!notifications?.length)
      return <div className='notification-list'>{t('No notifications')}</div>
   return (
      <ul className='notification-list'>
         <button className='clear-btn' onClick={onClear}>
            {t('Clear notifications')}
         </button>
         {notifications.map(notification => (
            <NotificationPreview
               key={notification.id}
               notification={notification}
            />
         ))}
      </ul>
   )
}
