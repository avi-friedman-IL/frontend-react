import { t } from 'i18next'
import { NotificationPreview } from './NotificationPreview.jsx'
import { socketService } from '../services/socket.service.js'
export function NotificationList({ users, user, notifications }) {
   function onClear() {
      const userToUpdate = users.find(currUser => currUser._id === user._id)
      const updatedUser = { ...userToUpdate, notifications: [] }
      socketService.emit('user-update', updatedUser)
   }

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
