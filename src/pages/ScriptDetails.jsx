import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { scriptService } from '../services/script'
import { ObjectionIndex } from './ObjectionIndex'
import { TipsIndex } from './TipsIndex.jsx'
import { MdTextDecrease, MdTextIncrease } from 'react-icons/md'
import { useSelector } from 'react-redux'

export function ScriptDetails() {
   const params = useParams()
   const user = useSelector(state => state.userModule.user)

   const [script, setScript] = useState(null)
   const [fontSize, setFontSize] = useState(24)

   useEffect(() => {
      loadScript()
   }, [params.id])

   async function loadScript() {
      try {
         const script = await scriptService.getById(params.id)
         setScript(script)
      } catch (err) {
         console.log('Cannot load script', err)
      }
   }

   if (!script) return <div className='loading'>{t('Loading...')}</div>
   return (
      <section className='script-details'>
         <TipsIndex />
         <ul className='items'>
            {user?.isAdmin && (
               <Link className='edit-btn' to={`/script/edit/${script._id}`}>
                  {t('Edit Script')}
               </Link>
            )}
            {script.items.map(item => (
               <li
                  id={item.id}
                  key={item.id}
                  className='item'
                  style={{ fontSize: `${fontSize}px` }}>
                  <div className='title'>
                     <h2 style={{ fontSize: `${fontSize * 2}px` }}>
                        {t(item.title)}
                     </h2>
                  </div>
                  <p
                     autoFocus
                     className='content'
                     dangerouslySetInnerHTML={{ __html: item.content }}
                  />
               </li>
            ))}
         </ul>
         <ul className='script-details-btns'>
            <button
               className='btn1'
               onClick={() => setFontSize(fontSize => (fontSize < 80 ? fontSize += 5 : fontSize))}
               title={t('Increase text')}>
               <MdTextIncrease />
            </button>
            <button
               className='btn1'
               onClick={() => setFontSize(fontSize => (fontSize > 10 ? fontSize -= 5 : fontSize))}
               title={t('Decrease text')}>
               <MdTextDecrease />
            </button>
         </ul>
         <ObjectionIndex />
      </section>
   )
}
