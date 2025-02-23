import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadScripts } from '../store/actions/script.actions'
import { t } from 'i18next'

import { ScriptList } from '../cmps/ScriptList.jsx'
import { AddScript } from '../cmps/AddScript.jsx'

export function ScriptIndex() {
   const scripts = useSelector(state => state.scriptModule.scripts)
   const [isOpen, setIsOpen] = useState(false)

   useEffect(() => {
      load()
      console.log('scripts:', scripts)
   }, [scripts?.length])

   async function load() {
      try {
         await loadScripts()
      } catch (err) {
         console.log('Cannot load scripts', err)
      }
   }

   if (!scripts) return <div>{t('loading')}</div>
   return (
      <section className='script-index'>
         <button onClick={() => setIsOpen(true)} className='add-btn btn1'>
            {t('Add Script')}
         </button>
         <ScriptList scripts={scripts} />
         {isOpen && <AddScript setIsOpen={setIsOpen} />}
      </section>
   )
}
