import { t } from 'i18next'
import { NotificationPreview } from './NotificationPreview.jsx'
import { socketService } from '../services/socket.service.js'
import { useEffect, useState } from 'react'
export function NotificationList({ users, user }) {
   const [notifications, setNotifications] = useState(null)

   useEffect(() => {
      if (!user) return
      const userToUpdate = users.find(currUser => currUser._id === user._id)
      setNotifications(userToUpdate.notifications)
   }, [user, users])

   function onClear() {
      const userToUpdate = users.find(currUser => currUser._id === user._id)
      const updatedUser = { ...userToUpdate, notifications: [] }
      socketService.emit('user-update', updatedUser)
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
