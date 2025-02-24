import { Provider } from 'react-redux'
import { Route, Routes } from 'react-router'
import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { store } from './store/store'
import { HomePage } from './pages/HomePage'
import { AppHeader } from './cmps/AppHeader'
import { MembersIndex } from './pages/MembersIndex'
import { UserMsg } from './cmps/UserMsg'
import { ChatIndex } from './pages/ChatIndex'
import { ObjectionIndex } from './pages/ObjectionIndex'

import './assets/style/main.scss'
import { t } from 'i18next'
import { ObjectionDetails } from './pages/ObjectionDetails.jsx'
import { ScriptIndex } from './pages/ScriptIndex.jsx'
import { ScriptDetails } from './pages/ScriptDetails.jsx'
import { RespectForm } from './cmps/RespectForm.jsx'
import { MsgIndex } from './pages/MsgIndex.jsx'
import { showRespectMsg } from './services/event-bus.service.js'
import { socketService } from './services/socket.service.js'

export function RootCmp() {
   const { i18n } = useTranslation()
   const [isOpenRespectForm, setIsOpenRespectForm] = useState(false)

   useEffect(() => {
      if (!socketService.isConnected()) socketService.setup()
      socketService.on('on-respected-msg', onRespectMsg)
      return () => {
         socketService.off('on-respected-msg', onRespectMsg)
      }
   }, [])

   useEffect(() => {
      const defaultLanguage = 'he'
      i18n.changeLanguage(defaultLanguage)

      const direction = defaultLanguage === 'he' ? 'rtl' : 'ltr'
      document.documentElement.setAttribute('dir', direction)
      document.documentElement.setAttribute('lang', defaultLanguage)
   }, [i18n])

   function onRespectMsg({ userName, amount }) {
      return showRespectMsg(
         `${userName} ${t('recruit now')} ${amount} ` + t('Shekel')
      )
   }

   return (
      <Provider store={store}>
         <main className='main-layout'>
            <AppHeader />
            <UserMsg />
            <button
               className='respect-btn btn1'
               onClick={() => setIsOpenRespectForm(true)}>
               {t('Tell friends')}
            </button>
            {isOpenRespectForm && (
               <RespectForm setIsOpenRespectForm={setIsOpenRespectForm} />
            )}
            <Routes>
               <Route path='/' element={<HomePage />} />
               <Route path='/script' element={<ScriptIndex />} />
               <Route path='/objection' element={<ObjectionIndex />} />
               <Route
                  path='/objection/details/:id'
                  element={<ObjectionDetails />}
               />
               <Route
                  path='/objection/details/:id/:itemId'
                  element={<ObjectionDetails />}
               />
               <Route path='/script/details/:id' element={<ScriptDetails />} />
               <Route path='/chat' element={<ChatIndex />} />
               <Route path='/msg' element={<MsgIndex />} />
               <Route path='/members' element={<MembersIndex />} />
            </Routes>
         </main>
      </Provider>
   )
}
