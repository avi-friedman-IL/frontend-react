import { useEffect, useState } from 'react'
import { loadScripts } from '../store/actions/script.actions.js'
import { useSelector } from 'react-redux'

import { ScriptList } from '../cmps/ScriptList.jsx'
import { Outlet } from 'react-router-dom'
import { AddScript } from '../cmps/AddScript.jsx'
import { t } from 'i18next'

export function ScriptIndex() {
   const scripts = useSelector(state => state.scriptModule.scripts)

   const [isOpen, setIsOpen] = useState(false)

   useEffect(() => {
      load()
   }, [scripts.length])

   async function load() {
      try {
         await loadScripts()
      } catch (err) {
         console.log('Cannot load scripts', err)
      }
   }

   return (
      <section className='script-index'>
         <button onClick={() => setIsOpen(true)} className='btn1'>
            {t('add script')}
         </button>
         {isOpen && <AddScript setIsOpen={setIsOpen} />}
         <ScriptList scripts={scripts} />
         <Outlet />
      </section>
   )
}
