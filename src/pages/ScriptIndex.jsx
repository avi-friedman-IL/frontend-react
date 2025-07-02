import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadScripts, removeScript } from '../store/actions/script.actions'
import { t } from 'i18next'

import { ScriptList } from '../cmps/ScriptList.jsx'
import { Link } from 'react-router-dom'

export function ScriptIndex() {
   const scripts = useSelector(state => state.scriptModule.scripts)
   const filterBy = useSelector(state => state.scriptModule.filterBy)
   const [isOpen, setIsOpen] = useState(false)
   const user = useSelector(state => state.userModule.user)

   useEffect(() => {
      load()
   }, [])

   async function load() {
      try {
         const initialFilter = { ...filterBy, gender: user?.gender }
         await loadScripts(initialFilter)
      } catch (err) {
         console.log('Cannot load scripts', err)
      }
   }

   async function onRemove(ev, scriptId) {
      ev.stopPropagation()
      const isConfirmed = window.confirm(
         t('Are you sure you want to delete this script?')
      )
      if (!isConfirmed) return
      try {
         await removeScript(scriptId)
      } catch (err) {
         console.log('Cannot remove script', err)
      }
   }

   if (!scripts) return <div>{t('loading')}</div>
   return (
      <section className='script-index'>
         {user?.isAdmin && (
            <Link className='add-btn btn1' to='/script/edit'>
               {t('Add Script')}
            </Link>
         )}
         <ScriptList scripts={scripts} onRemove={onRemove} user={user} />
      </section>
   )
}
