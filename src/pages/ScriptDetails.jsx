import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { loadScripts } from '../store/actions/script.actions'
import { scriptService } from '../services/script'
import { ObjectionIndex } from './ObjectionIndex'
import { TipsIndex } from './TipsIndex.jsx'
import { BiEdit } from 'react-icons/bi'
import { ItemEdit } from '../cmps/ItemEdit.jsx'
import { AiOutlineEdit } from 'react-icons/ai'

export function ScriptDetails() {
   const params = useParams()

   const [refs, setRefs] = useState({})
   const [script, setScript] = useState(null)
   const [fontSize, setFontSize] = useState(24)
   const [openItemId, setOpenItemId] = useState(null)

   useEffect(() => {
      loadScript()
   }, [params.id, openItemId])

   async function loadScript() {
      try {
         // if (!script.length) await loadScripts()
         const script = await scriptService.getById(params.id)
         setScript(script)
      } catch (err) {
         console.log('Cannot load script', err)
      }
   }

   if (!script) return <div>Loading...</div>
   return (
      <section className='script-details'>
         <TipsIndex />
         <ul className='script-details-btns'>
            <button
               className='btn1'
               onClick={() => setFontSize(fontSize => (fontSize += 5))}>
               {t('Increase text')}
            </button>
            <button
               className='btn1'
               onClick={() => setFontSize(fontSize => (fontSize -= 5))}>
               {t('Decrease text')}
            </button>
         </ul>
         <ul className='items'>
            {script.items.map(item => (
               <li
                  id={item.id}
                  key={item.id}
                  ref={refs[item.id]}
                  className='item'
                  style={{ fontSize: `${fontSize}px` }}>
                  <div className='title'>
                     <h2
                     style={{fontSize: `${fontSize * 2}px`}}
                     >{t(item.title)}</h2>
                     <button
                        className='btn3'
                        onClick={() => setOpenItemId(item.id)}>
                        <span>{t('Edit')}</span>
                        <AiOutlineEdit />
                     </button>
                  </div>
                  {openItemId !== item.id && (
                     <p
                        autoFocus
                        className='content'
                        dangerouslySetInnerHTML={{ __html: item.content }}
                     />
                  )}
                  {openItemId === item.id && (
                     <ItemEdit
                        item={item}
                        setOpenItemId={setOpenItemId}
                        currObjection={script}
                     />
                  )}
               </li>
            ))}
         </ul>

         <ObjectionIndex />
      </section>
   )
}
