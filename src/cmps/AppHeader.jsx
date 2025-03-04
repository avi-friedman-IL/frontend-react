import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import { NotificationList } from './NotificationList.jsx'

import {
   MdLanguage,
   MdOutlineMailOutline,
   MdWifiCalling3,
} from 'react-icons/md'
import { IoHomeOutline } from 'react-icons/io5'
import { BiChat } from 'react-icons/bi'

import { Tooltip } from './Tooltip'

export function AppHeader() {
   const user = useSelector(state => state.userModule.user)
   const users = useSelector(state => state.userModule.users)

   const [isOpenLanguage, setIsOpenLanguage] = useState(false)
   const [isOpenNotification, setIsOpenNotification] = useState(false)
   const [isTooltipOpen, setIsTooltipOpen] = useState(false)
   const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
   const [tooltipText, setTooltipText] = useState('')

   const timeoutRef = useRef(null)
   const languageRef = useRef(null)

   const { t, i18n } = useTranslation()

   useEffect(() => {
      function handleClickOutside(event) {
         if (
            languageRef.current &&
            !languageRef.current.contains(event.target)
         ) {
            setIsOpenLanguage(false)
         }
      }

      document.addEventListener('mousedown', handleClickOutside)

      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [users, user])

   function changeLanguage(lang) {
      document.body.dir = lang === 'he' ? 'rtl' : 'ltr'

      i18n.changeLanguage(lang)
      setIsOpenLanguage(false)
      localStorage.setItem('language', lang)
   }

   function handleMouseEnter(ev) {
      ev.preventDefault()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
         setIsTooltipOpen(true)
      }, 500)
      i18n.dir() === 'rtl'
         ? setTooltipPos({ x: ev.pageX - 80, y: ev.pageY - 10 })
         : setTooltipPos({ x: ev.pageX + 10, y: ev.pageY - 10 })
   }

   function handleMouseLeave() {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
         setIsTooltipOpen(false)
      }, 500)
   }
   // if (!users?.length || !user) return <div>Loading...</div>
   return (
      <section className='app-header'>
         {isTooltipOpen && <Tooltip position={tooltipPos} text={tooltipText} />}
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
            </nav>
         )}
         <div className='user-info' ref={languageRef}>
            {/* {user && (
               <a
                  className='language-btn'
                  onClick={() => setIsOpenLanguage(open => !open)}>
                  <MdLanguage />
                  <span>{i18n.language === 'en' ? 'EN' : 'עברית'}</span>
               </a>
            )} */}
            {user && (
               <div
                  className='user-btn'
                  onClick={() => setIsOpenNotification(open => !open)}>
                  {/* <img className='img-url' src={user.imgUrl} alt='' /> */}
                  <span className='user-img'>
                     {user.fullname.split(' ')[0].charAt(0).toUpperCase()}
                  </span>
                  <span>{user.fullname.split(' ')[0]}</span>
                  {
                     <span className='notifications'>
                        {
                           users?.find(currUser => currUser._id === user._id)
                              ?.notifications?.length
                        }
                     </span>
                  }
               </div>
            )}
            {isOpenNotification && (
               <NotificationList users={users} user={user} />
            )}
            {isOpenLanguage && (
               <ul
                  className='language-list'
                  onBlur={() => setIsOpenLanguage(false)}>
                  <li onClick={() => changeLanguage('en')}>english</li>
                  <li onClick={() => changeLanguage('he')}>עברית</li>
               </ul>
            )}
         </div>
      </section>
   )
}
