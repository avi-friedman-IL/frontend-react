import { Provider } from 'react-redux'
import { Route, Routes } from 'react-router'
import './assets/style/main.scss'

import { store } from './store/store'
import { HomePage } from './pages/HomePage'
import { AppHeader } from './cmps/AppHeader'
import { UserMsg } from './cmps/UserMsg'
import { ChatIndex } from './pages/ChatIndex'
import { ObjectionIndex } from './pages/ObjectionIndex'
import { TemplateEdit } from './pages/TemplateEdit.jsx'
import { ObjectionDetails } from './pages/ObjectionDetails.jsx'
import { ScriptIndex } from './pages/ScriptIndex.jsx'
import { ScriptDetails } from './pages/ScriptDetails.jsx'
import { MsgIndex } from './pages/MsgIndex.jsx'
import { UserIndex } from './pages/UserIndex.jsx'
import { RespectBtn } from './cmps/RespectBtn.jsx'
import { TemplateIndex } from './pages/TemplateIndex.jsx'
import { TrainingIndex } from './pages/TrainingIndex.jsx'
import { TrainingEdit } from './pages/TrainingEdit.jsx'
import { TrainingDetails } from './pages/TrainingDetails.jsx'
import { ScriptEdit } from './pages/ScriptEdit.jsx'

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
               <Route path='/script/edit' element={<ScriptEdit />} />
               <Route path='/script/edit/:id' element={<ScriptEdit />} />
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
               <Route path='/users' element={<UserIndex />} />
               <Route path='/template' element={<TemplateIndex />} />
               <Route path='/template/edit' element={<TemplateEdit />} />
               <Route path='/training' element={<TrainingIndex />} />
               <Route path='/training/edit' element={<TrainingEdit />} />
               <Route path='/training/edit/:id' element={<TrainingEdit />} />
               <Route
                  path='/training/details/:id'
                  element={<TrainingDetails />}
               />
            </Routes>
         </main>
      </Provider>
   )
}
