import { Provider } from 'react-redux'
import { Route, Routes } from 'react-router'
import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { store } from './store/store'
import { HomePage } from './pages/HomePage'
import { AppHeader } from './cmps/AppHeader'
import { MembersIndex } from './pages/MembersIndex'
import { UserMsg } from './cmps/UserMsg'
import { ChatIndex } from './pages/ChatIndex'
import { ScriptIndex } from './pages/ScriptIndex'

import './assets/style/main.scss'
import { ScriptDetails } from './pages/ScriptDetails.jsx'

export function RootCmp() {
   const { i18n } = useTranslation()

   useEffect(() => {
      const defaultLanguage = localStorage.getItem('language') || 'he'
      i18n.changeLanguage(defaultLanguage)

      const direction = defaultLanguage === 'he' ? 'rtl' : 'ltr'
      document.documentElement.setAttribute('dir', direction)
      document.documentElement.setAttribute('lang', defaultLanguage)
   }, [i18n])

   return (
      <Provider store={store}>
         <main className='main-layout'>
            <AppHeader />
            <UserMsg />
            <Routes>
               <Route path='/' element={<HomePage />} />

               <Route path='/script' element={<ScriptIndex />}>
                  {/* <Route path='edit/:id' element={<ScriptEdit />} /> */}
               </Route>
               <Route path='/script/details/:id' element={<ScriptDetails />} />

               <Route path='/chat' element={<ChatIndex />} />
               <Route path='/members' element={<MembersIndex />} />
            </Routes>
         </main>
      </Provider>
   )
}
