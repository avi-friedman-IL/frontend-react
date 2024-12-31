import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { BiChat } from 'react-icons/bi'
import { IoMdContacts } from 'react-icons/io'
import { IoHomeOutline } from 'react-icons/io5'
import { MdLanguage } from 'react-icons/md'
import { TbPhoneCalling } from 'react-icons/tb'

import { Tooltip } from './Tooltip'

export function AppHeader() {
   const user = useSelector(state => state.userModule.user)
   const [isOpen, setIsOpen] = useState(false)
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
            setIsOpen(false)
         }
      }

      document.addEventListener('mousedown', handleClickOutside)

      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [])

   function changeLanguage(lang) {
      document.body.dir = lang === 'he' ? 'rtl' : 'ltr'

      i18n.changeLanguage(lang)
      setIsOpen(false)
      localStorage.setItem('language', lang)
   }

   function handleMouseEnter(ev) {
      ev.preventDefault()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
         setIsTooltipOpen(true)
      }, 500)
      setTooltipPos({ x: ev.pageX - 80, y: ev.pageY - 10 })
   }

   function handleMouseLeave() {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
         setIsTooltipOpen(false)
      }, 500)
   }

   return (
      <section className='app-header'>
         {isTooltipOpen && <Tooltip position={tooltipPos} text={tooltipText} />}
         {user && (
            <nav className='app-nav'>
               <NavLink to={'/'}>
                  <IoHomeOutline />
               </NavLink>
               <NavLink
                  to={'/script'}
                  onMouseEnter={ev => {
                     setTooltipText(t('scripts'))
                     handleMouseEnter(ev)
                  }}
                  onMouseLeave={handleMouseLeave}>
                  <TbPhoneCalling />
               </NavLink>

               <NavLink
                  to={'/chat'}
                  onMouseEnter={ev => {
                     setTooltipText(t('chats'))
                     handleMouseEnter(ev)
                  }}
                  onMouseLeave={handleMouseLeave}>
                  <BiChat />
               </NavLink>

               <NavLink
                  to={'/members'}
                  onMouseEnter={ev => {
                     setTooltipText(t('members'))
                     handleMouseEnter(ev)
                  }}
                  onMouseLeave={handleMouseLeave}>
                  <IoMdContacts />
               </NavLink>
            </nav>
         )}
         <div className='user-info' ref={languageRef}>
            {user && (
               <span
                  className='img-url'
                  onClick={() => setIsOpen(open => !open)}
                  onMouseEnter={ev => {
                     setTooltipText(t('change language'))
                     handleMouseEnter(ev)
                  }}
                  onMouseLeave={handleMouseLeave}>
                  <MdLanguage />
               </span>
            )}
            {user && <img className='img-url' src={user.imgUrl} alt='' />}
            {isOpen && (
               <ul className='language-list' onBlur={() => setIsOpen(false)}>
                  <li onClick={() => changeLanguage('en')}>english</li>
                  <li onClick={() => changeLanguage('he')}>עברית</li>
               </ul>
            )}
         </div>
      </section>
   )
}
