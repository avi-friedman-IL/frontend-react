import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { BiEdit } from 'react-icons/bi'
import { TfiBackRight } from 'react-icons/tfi'

import { scriptService } from '../services/script'
import { useSelector } from 'react-redux'
import { loadScripts } from '../store/actions/script.actions'
import { ItemEdit } from '../cmps/ItemEdit.jsx'
import { ScriptStyle } from '../cmps/ScriptStyle.jsx'
import { convertToTransparent } from '../services/util.service.js'
import { AddItem } from '../cmps/AddItem.jsx'
import { t } from 'i18next'

export function ScriptDetails() {
   const navigate = useNavigate()
   const params = useParams()

   const scripts = useSelector(state => state.scriptModule.scripts)

   const [currScript, setCurrScript] = useState(null)
   const [openItemId, setOpenItemId] = useState(null)
   const [selectedItemId, setSelectedItemId] = useState(null)
   const [isOpenAddItem, setIsOpenAddItem] = useState(false)

   const openItemRef = useRef(null)
   useEffect(() => {
      loadScript()
   }, [params.id, scripts.length, openItemId, isOpenAddItem])

   useEffect(() => {
      const handleClickOutside = event => {
         if (
            openItemRef.current &&
            !openItemRef.current.contains(event.target)
         ) {
            setSelectedItemId(null)
         }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [])

   async function loadScript() {
      try {
         if (!scripts.length) await loadScripts()
         const script = await scriptService.getById(params.id)
         setCurrScript(script)
      } catch (err) {
         console.log('Cannot load script', err)
      }
   }

   function parsedContent(content) {
      try {
         const parsedContent = JSON.parse(content)
         return (
            parsedContent?.root?.children
               ?.map(paragraph =>
                  paragraph.children?.map(node => node.text).join(' ')
               )
               .join('\n') || ''
         )
      } catch (error) {
         return content
      }
   }
   return (
      <section
         className='script-details'
         style={{
            backgroundColor: currScript?.style?.color
               ? convertToTransparent(currScript.style.color, 0.2)
               : 'transparent',
         }}>
         <h1>{currScript?.category}</h1>
         <div className='actions'>
            <ScriptStyle
               currScript={currScript}
               setCurrScript={setCurrScript}
            />
            <button
               className='add-btn btn2'
               onClick={() => setIsOpenAddItem(true)}>
               {t('add item')}
            </button>
         </div>
         {isOpenAddItem && (
            <AddItem
               currScript={currScript}
               setCurrScript={setCurrScript}
               setIsOpenAddItem={setIsOpenAddItem}
            />
         )}
         <ul
            className='script-details-main'
            style={{
               gridTemplateColumns:
                  currScript?.style?.layout === 'column'
                     ? 'repeat(auto-fill, minmax(200px, 1fr))'
                     : 'none',
            }}>
            {currScript?.items?.map(item => (
               <li
                  className={`item${`${
                     selectedItemId === item.id ? '-selected' : ''
                  }`}`}
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  ref={selectedItemId === item.id ? openItemRef : null}
                  style={{
                     boxShadow:
                        selectedItemId === item.id
                           ? `${item.style?.color} 0px 1px 2px 2px`
                           : 'none',
                  }}>
                  {openItemId !== item.id && (
                     <div className='details-item-btns'>
                        <button
                           className='btn2'
                           onClick={() => setOpenItemId(item.id)}>
                           <BiEdit
                              style={{ fill: item.style?.color || 'black' }}
                           />
                        </button>
                     </div>
                  )}
                  {openItemId === item.id && (
                     <ItemEdit
                        item={item}
                        setOpenItemId={setOpenItemId}
                        currScript={currScript}
                        parsedContent={parsedContent}
                     />
                  )}

                  {openItemId !== item.id && (
                     <div className='item-content'>
                        <h2
                           style={{
                              color: item.style?.color || 'black',
                           }}>
                           {item.title}
                        </h2>

                        <p dangerouslySetInnerHTML={{ __html: item.content }} />
                     </div>
                  )}
               </li>
            ))}
         </ul>

         <ul className='script-details-links'>
            <button className='btn1' onClick={() => navigate('/script')}>
               <TfiBackRight />
            </button>

            {scripts.length &&
               scripts.map(script => (
                  <li
                     className='link btn2'
                     onClick={() => navigate(`/script/details/${script._id}`)}
                     key={script._id}
                     style={{
                        '--bg-color-link':
                           script._id === currScript?._id
                              ? 'rgba(210, 210, 220, 0.4)'
                              : 'white',
                     }}>
                     {script.category}
                  </li>
               ))}
         </ul>
      </section>
   )
}
