import { useSelector } from 'react-redux'
import { LoginWithGoogle } from '../cmps/LoginWithGoogle'
import { loadUsers, logout } from '../store/actions/user.actions'
import { IoHomeOutline, IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { MdWifiCalling3 } from 'react-icons/md'
import { BiChat } from 'react-icons/bi'
import { MdOutlineMailOutline } from 'react-icons/md'
import { t } from 'i18next'
import { useEffect } from 'react'
import { LoginForm } from '../cmps/LoginForm.jsx'
import { NavLink } from 'react-router-dom'

export function HomePage() {
   const user = useSelector(state => state.userModule.user)

   useEffect(() => {
      load()
   }, [])

   async function load() {
      try {
         await loadUsers()
      } catch (err) {
         console.log('HomePage: err in load', err)
      }
   }

   async function onLogout() {
      try {
         await logout()
      } catch (err) {
         console.log('HomePage: err in logout', err)
      }
   }

   return (
      <section className='home-page'>
         <header className={`home-header ${user ? '' : 'justify-end'}`}>
            {user && (
               <button className='logout-btn' onClick={onLogout}>
                  {t('logout')}
               </button>
            )}
               {/* <IoChatbubbleEllipsesOutline /> */}
               <img className='logo'
                  // src='https://res.cloudinary.com/dcymxvtnd/image/upload/v1737468159/ydamq97cqradrdjgxyn5.png'
                  src='https://res.cloudinary.com/dcymxvtnd/image/upload/v1740566743/phherpui8pthmojx02k1.png'
                  alt=''
               />
         </header>
         {!user && (
            // <div className='login-container'>
            <div className='form2'>
               <LoginForm />
               {/* <p>{t('Or')}</p>
               <LoginWithGoogle /> */}
            </div>
         )}

         {user && (
            <nav className='home-nav'>
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
      </section>
   )
}
