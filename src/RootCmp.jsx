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
import { ObjectionIndex } from './pages/ObjectionIndex'

import './assets/style/main.scss'
import { ObjectionDetails } from './pages/ObjectionDetails.jsx'
import { ScriptIndex } from './pages/ScriptIndex.jsx'
import { ScriptDetails } from './pages/ScriptDetails.jsx'
import { MsgIndex } from './pages/MsgIndex.jsx'
import { UserIndex } from './pages/UserIndex.jsx'
import { RespectBtn } from './cmps/RespectBtn.jsx'
export function RootCmp() {

   return (
      <Provider store={store}>
         <main className='main-layout'>
            <AppHeader />
            <UserMsg />
            <RespectBtn />
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
               <Route path='/users' element={<UserIndex />} />
            </Routes>
         </main>
      </Provider>
   )
}
