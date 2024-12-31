import { useSelector } from 'react-redux'
import { LoginWithGoogle } from '../cmps/LoginWithGoogle'
import { loadUsers, logout } from '../store/actions/user.actions'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { t } from 'i18next'
import { useEffect } from 'react'

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
         {user && <button className='logout-btn btn' onClick={onLogout}>{t('logout')}</button>}
         {!user && <LoginWithGoogle />}
        
         <div className='bg-icon'>
            <IoChatbubbleEllipsesOutline />
         </div>
      </section>
   )
}
