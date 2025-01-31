import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { loadScripts } from '../store/actions/script.actions'
import { scriptService } from '../services/script'
import { ObjectionIndex } from './ObjectionIndex'

export function ScriptDetails() {
   const params = useParams()

   const [refs, setRefs] = useState({})
   const [currSectionId, setCurrSectionId] = useState(null)
   const [script, setScript] = useState(null)
   const [fontSize, setFontSize] = useState(20)

   useEffect(() => {
      loadScript()
   }, [params.id])

   useEffect(() => {
      if (!script) return
      const refsReduce = script.items.reduce((acc, item) => {
         acc[item.id] = React.createRef()
         return acc
      }, {})
      setRefs(refsReduce)
   }, [script])

   useEffect(() => {
      if (!script || !Object.keys(refs).length) return
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

      script.items.forEach(item => {
         observer.observe(refs[item.id].current)
      })
      return () => observer.disconnect()
   }, [script, refs])

   async function loadScript() {
      try {
         // if (!script.length) await loadScripts()
         const script = await scriptService.getById(params.id)
         setScript(script)
      } catch (err) {
         console.log('Cannot load script', err)
      }
   }

   function scrollToSection(sectionId) {
      if (!sectionId) {
         refs[0].current.scrollIntoView({ behavior: 'smooth' })
         setCurrSectionId(script.items[0].id)
      } else {
         refs[sectionId].current.scrollIntoView({ behavior: 'smooth' })
         setCurrSectionId(sectionId)
      }
   }
   if (!script) return <div>Loading...</div>
   return (
      <section className='script-details'>
         <ul className='nav-btns'>
            {/* {script.items.map(item => (
               <li
                  className={`btn1 ${
                     currSectionId === item.id ? 'active' : ''
                  }`}
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}>
                  {t(item.title)}
               </li>
            ))}
            <Link className='scripts-btn btn1' to='/script'>
               {t('scripts')}
            </Link> */}
            <button className='btn2' onClick={() => setFontSize(fontSize => fontSize += 5)}>{`+`}</button>
            <button className='btn2' onClick={() => setFontSize(fontSize => fontSize -= 5)}>{`-`}</button>
         </ul>
         <ul className='items'>
            {script.items.map(item => (
               <li
                  id={item.id}
                  key={item.id}
                  ref={refs[item.id]}
                  className='item'
                  style={{ fontSize: `${fontSize}px` }}
                  >
                  <h2>{t(item.title)}</h2>
                  <p
                     autoFocus
                     className='content'
                     dangerouslySetInnerHTML={{ __html: item.content }}
                  />
               </li>
            ))}
         </ul>

         <ObjectionIndex />
      </section>
   )
}
