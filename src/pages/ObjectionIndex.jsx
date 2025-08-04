import { useEffect } from 'react'
import { loadObjections } from '../store/actions/objection.actions.js'
import { useSelector } from 'react-redux'

import { ObjectionList } from '../cmps/ObjectionList.jsx'
import { Outlet } from 'react-router-dom'

export function ObjectionIndex() {
   const objections = useSelector(state => state.objectionModule.objections)

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

   return (
      <section className='objection-index'>
         <ObjectionList objections={objections} />
         <Outlet />
      </section>
   )
}
