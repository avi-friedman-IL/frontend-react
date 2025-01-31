import { useEffect, useState } from 'react'
import { loadObjections } from '../store/actions/objection.actions.js'
import { useSelector } from 'react-redux'

import { ObjectionList } from '../cmps/ObjectionList.jsx'
import { Outlet } from 'react-router-dom'
import { AddObjection } from '../cmps/AddObjection.jsx'
import { t } from 'i18next'

export function ObjectionIndex() {
   const objections = useSelector(state => state.objectionModule.objections)
   // .filter(objection => objection.category !== 'mainObjection')

   const [isOpen, setIsOpen] = useState(false)

   useEffect(() => {
      load()
   }, [objections.length])

   async function load() {
      try {
         await loadObjections()
      } catch (err) {
         console.log('Cannot load objections', err)
      }
   }

   return (
      <section className='objection-index'>
         
         {/* <button onClick={() => setIsOpen(true)} className='btn1'>
            {t('add objection')}
         </button> */}
         {isOpen && <AddObjection setIsOpen={setIsOpen} />}
         <ObjectionList objections={objections} />
         <Outlet />
      </section>
   )
}
