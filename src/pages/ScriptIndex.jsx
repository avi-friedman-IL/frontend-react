import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { loadScripts } from '../store/actions/script.actions.js'
import { useSelector } from 'react-redux'

import { ScriptList } from '../cmps/ScriptList.jsx'
import { Link, Outlet } from 'react-router-dom'

export function ScriptIndex() {
   const scripts = useSelector(state => state.scriptModule.scripts)


   useEffect(() => {
      load()
   }, [scripts.length])

   async function load() {
      try {
         await loadScripts()
      } catch (err) {
         console.log('Cannot load scripts', err)
      }
      console.log('scripts:', scripts)
   }

   return (
      <section className='script-index'>
        

         <Link to='/script/edit' className='btn'>Add Script</Link>
         <ScriptList scripts={scripts} />
         <Outlet />
      </section>
   )
}
