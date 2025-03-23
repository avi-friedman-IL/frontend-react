import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadScripts, removeScript } from '../store/actions/script.actions'
import { t } from 'i18next'

import { ScriptList } from '../cmps/ScriptList.jsx'
import { AddScript } from '../cmps/AddScript.jsx'

export function ScriptIndex() {
   const scripts = useSelector(state => state.scriptModule.scripts)
   const [isOpen, setIsOpen] = useState(false)
   const user = useSelector(state => state.userModule.user)

   useEffect(() => {
      load()
   }, [scripts?.length])

   async function load() {
      try {
         await loadScripts()
      } catch (err) {
         console.log('Cannot load scripts', err)
      }
   }

   async function onRemove(ev, scriptId) {
      ev.stopPropagation()
      try {
         await removeScript(scriptId)
      } catch (err) {
         console.log('Cannot remove script', err)
      }
   }

   if (!scripts) return <div>{t('loading')}</div>
   return (
      <section className='script-index'>
         {user?.isAdmin && <button onClick={() => setIsOpen(true)} className='add-btn btn1'>
            {t('Add Script')}
         </button>}
         <ScriptList scripts={scripts} onRemove={onRemove} user={user} />
         {isOpen && <AddScript setIsOpen={setIsOpen} />}
      </section>
   )
}
