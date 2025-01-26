import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadObjections } from '../store/actions/objection.actions'
import { t } from 'i18next'
import {
   FaArrowDown,
   FaArrowUp,
   FaCircleArrowDown,
   FaCircleArrowUp,
} from 'react-icons/fa6'
import { Link } from 'react-router-dom'

export function MainScript() {
   const objection = useSelector(state =>
      state.objectionModule.objections.find(
         objection => objection.category === 'mainScript'
      )
   )

   const [refs, setRefs] = useState({})
   const [currSectionId, setCurrSectionId] = useState(objection?.items[0].id)

   useEffect(() => {
      load()
   }, [])

   useEffect(() => {
      if (!objection) return
      const refsReduce = objection.items.reduce((acc, item) => {
         acc[item.id] = React.createRef()
         return acc
      }, {})
      setRefs(refsReduce)
   }, [objection])

   useEffect(() => {
      if (!objection || !Object.keys(refs).length) return
      const observer = new IntersectionObserver(
         entries => {
            entries.forEach(entry => {
               if (entry.isIntersecting) {
                  setCurrSectionId(entry.target.id)
               }
            })
         },
         { threshold: 0.5 }
      )

      objection.items.forEach(item => {
         observer.observe(refs[item.id].current)
      })
      return () => observer.disconnect()
   }, [objection, refs])

   async function load() {
      try {
         await loadObjections()
      } catch (err) {
         console.log('Cannot load objections', err)
      }
   }

   function scrollToSection(sectionId) {
      if (!sectionId) {
         refs[0].current.scrollIntoView({ behavior: 'smooth' })
         setCurrSectionId(objection.items[0].id)
      } else {
         refs[sectionId].current.scrollIntoView({ behavior: 'smooth' })
         setCurrSectionId(sectionId)
      }
   }

   if (!objection) return <div>{t('loading')}</div>
   return (
      <section className='main-script'>
         <ul className='nav-btns'>
            {objection.items.map((item, idx) => (
               <li
                  className={`btn1 ${
                     currSectionId === item.id ? 'active' : ''
                  }`}
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}>
                  {t(item.title)}
               </li>
            ))}
            <Link className='objections-btn btn1' to='/objection'>
               {t('objections')}
            </Link>
         </ul>

         <ul className='items'>
            {objection.items.map((item, idx) => (
               <li
                  id={item.id}
                  key={item.id}
                  ref={refs[item.id]}
                  className='item'>
                  <p
                     className='content'
                     dangerouslySetInnerHTML={{ __html: item.content }}
                  />
               </li>
            ))}
         </ul>
      </section>
   )
}
