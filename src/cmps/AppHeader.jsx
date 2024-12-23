import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiChat } from 'react-icons/bi'
import { IoMdContacts } from 'react-icons/io'
import { IoHomeOutline } from 'react-icons/io5'
import { MdLanguage } from 'react-icons/md'
import { TbPhoneCalling } from 'react-icons/tb'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

export function AppHeader() {
   const user = useSelector(state => state.userModule.user)
   const [isOpen, setIsOpen] = useState(false)
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

   return (
      <section className='app-header'>
         <nav className='app-nav'>
            <NavLink to={'/'}>
               <IoHomeOutline />
            </NavLink>
            <NavLink to={'/script'}>
               <TbPhoneCalling />
            </NavLink>
            {user && (
               <NavLink to={'/chat'}>
                  <BiChat />
               </NavLink>
            )}
            {user && (
               <NavLink to={'/members'}>
                  <IoMdContacts />
               </NavLink>
            )}
         </nav>

         <div className='user-info' ref={languageRef}>
            {user && (
               <span
                  className='img-url'
                  onClick={() => setIsOpen(open => !open)}>
                  <MdLanguage />
               </span>
            )}
            {user && <img className='img-url' src={user.imgUrl} alt='' />}
            {isOpen && (
               <ul className='language-list' onBlur={() => setIsOpen(false)}>
                  <li onClick={() => changeLanguage('en')}>🇺🇸</li>
                  <li onClick={() => changeLanguage('he')}>🇮🇱</li>
               </ul>
            )}
         </div>
      </section>
   )
}
