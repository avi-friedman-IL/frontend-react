import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadObjections } from '../store/actions/objection.actions'
import { t } from 'i18next'

import { ScriptList } from '../cmps/ScriptList.jsx'

export function ScriptIndex() {
   const scripts = useSelector(
      state => state.objectionModule.objections
   ).filter(objection => objection.category === 'mainScript')

   useEffect(() => {
      load()
   }, [])

   async function load() {
      try {
         await loadObjections()
      } catch (err) {
         console.log('Cannot load objections', err)
      }
   }

   if (!scripts) return <div>{t('loading')}</div>
   return (
      <section className='script-index'>
         <ScriptList scripts={scripts} />
      </section>
   )
}
