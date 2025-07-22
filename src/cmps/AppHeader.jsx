import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import { updateUser } from '../store/actions/user.actions.js'
import { UPDATE_USER } from '../store/reducers/user.reducer.js'
import {
   SOCKET_EVENT_USER_UPDATED,
   socketService,
} from '../services/socket.service.js'
import { NotificationList } from './NotificationList.jsx'
import { IoHomeOutline } from 'react-icons/io5'
import { BiChat } from 'react-icons/bi'
import {
   MdOutlineMailOutline,
   MdOutlineManageAccounts,
   MdWifiCalling3,
   MdModelTraining,
} from 'react-icons/md'

export function AppHeader() {
   const user = useSelector(state => state.userModule.user)
   const users = useSelector(state => state.userModule.users)
   const dispatch = useDispatch()

   const [isOpenNotification, setIsOpenNotification] = useState(false)

   const { t } = useTranslation()

   useEffect(() => {
      socketService.on(SOCKET_EVENT_USER_UPDATED, updatedUser => {
         dispatch({ type: UPDATE_USER, user: updatedUser })
      })
      return () => {
         socketService.off(SOCKET_EVENT_USER_UPDATED)
      }
   }, [])

   async function onUpdateUser(updatedUser) {
      try {
         await updateUser(updatedUser)
      } catch (err) {
         console.log('Cannot update user', err)
      }
   }
   const userImg = user?.fullname.split(' ')[0].charAt(0).toUpperCase()
   const userName = user?.fullname.split(' ')[0]
   const notifications = user?.notifications?.length
   const isNotifications = user?.notifications?.length > 0 && isOpenNotification
   return (
      <section className='app-header'>
         {user && (
            <nav className='app-nav'>
               <NavLink to={'/'}>
                  <span className='icon'>
                     <IoHomeOutline />
                  </span>
                  <span>{t('home')}</span>
               </NavLink>
               <NavLink to={'/script'}>
                  <span className='icon'>
                     <MdWifiCalling3 />
                  </span>
                  <span>{t('scripts')}</span>
               </NavLink>

               <NavLink to={'/chat'}>
                  <span className='icon'>
                     <BiChat />
                  </span>
                  <span>{t('chats')}</span>
               </NavLink>

               <NavLink to={'/msg'}>
                  <span className='icon'>
                     <MdOutlineMailOutline />
                  </span>
                  <span>{t('msgs')}</span>
               </NavLink>
               <NavLink to={'/training'}>
                  <span className='icon'>
                     <MdModelTraining />
                  </span>
                  <span>{t('trainings')}</span>
               </NavLink>
               {user.isAdmin && (
                  <NavLink to={'/users'}>
                     <span className='icon'>
                        <MdOutlineManageAccounts />
                     </span>
                     <span>{t('users')}</span>
                  </NavLink>
               )}
            </nav>
         )}
         <div className='user-info'>
            {user && (
               <div
                  className='user-btn'
                  onClick={() => setIsOpenNotification(open => !open)}>
                  <span
                     className='user-img'
                     style={{ backgroundColor: user.color }}>
                     {userImg}
                  </span>
                  <span>{userName}</span>

                  {notifications > 0 && (
                     <span className='notifications'>{notifications}</span>
                  )}
               </div>
            )}
            {isNotifications && (
               <NotificationList
                  notifications={user?.notifications}
                  users={users}
                  user={user}
                  onUpdateUser={onUpdateUser}
               />
            )}
         </div>
      </section>
   )
}
