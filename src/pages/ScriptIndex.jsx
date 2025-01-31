import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadScripts } from '../store/actions/script.actions'
import { t } from 'i18next'

import { ScriptList } from '../cmps/ScriptList.jsx'

export function ScriptIndex() {
   const scripts = useSelector(state => state.scriptModule.scripts)

   useEffect(() => {
      load()
   }, [scripts])

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
         <ScriptList scripts={scripts} />
      </section>
   )
}
