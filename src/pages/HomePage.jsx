import { useSelector } from 'react-redux'
import { loadUsers, logout } from '../store/actions/user.actions'
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
         if (user) {
            await loadUsers()
         }
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
            <img
               className='logo'
               src='https://res.cloudinary.com/dcymxvtnd/image/upload/v1740566743/phherpui8pthmojx02k1.png'
               alt=''
            />
         </header>
         {!user && (
            <div className='form2'>
               <LoginForm />
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
