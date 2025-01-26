import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { BiEdit } from 'react-icons/bi'
import { TfiBackRight } from 'react-icons/tfi'

import { objectionService } from '../services/objection'
import { useSelector } from 'react-redux'
import { loadObjections } from '../store/actions/objection.actions'
import { ItemEdit } from '../cmps/ItemEdit.jsx'
import { ObjectionStyle } from '../cmps/ObjectionStyle.jsx'
import { convertToTransparent } from '../services/util.service.js'
import { AddItem } from '../cmps/AddItem.jsx'
import { t } from 'i18next'

export function ObjectionDetails() {
   const navigate = useNavigate()
   const params = useParams()

   const objections = useSelector(state => state.objectionModule.objections)

   const [currObjection, setCurrObjection] = useState(null)
   const [openItemId, setOpenItemId] = useState(null)
   const [selectedItemId, setSelectedItemId] = useState(null)
   const [fullScreenItemId, setFullScreenItemId] = useState(null)
   const [isOpenAddItem, setIsOpenAddItem] = useState(false)

   const openItemRef = useRef(null)
   useEffect(() => {
      loadObjection()
   }, [params.id, objections.length, openItemId, isOpenAddItem])

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

   async function loadObjection() {
      try {
         if (!objections.length) await loadObjections()
         const objection = await objectionService.getById(params.id)
         setCurrObjection(objection)
      } catch (err) {
         console.log('Cannot load objection', err)
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
         className='objection-details'
         style={{
            backgroundColor: currObjection?.style?.color
               ? convertToTransparent(currObjection.style.color, 0.2)
               : 'transparent',
         }}>
         <h1>{currObjection?.category}</h1>
         <div className='actions'>
            <ObjectionStyle
               currObjection={currObjection}
               setCurrObjection={setCurrObjection}
            />
            <button
               className='add-btn btn2'
               onClick={() => setIsOpenAddItem(true)}>
               {t('add item')}
            </button>
         </div>
         {isOpenAddItem && (
            <AddItem
               currObjection={currObjection}
               setCurrObjection={setCurrObjection}
               setIsOpenAddItem={setIsOpenAddItem}
            />
         )}
         <ul
            className='objection-details-main'
            style={{
               gridTemplateColumns:
                  currObjection?.style?.layout === 'column'
                     ? 'repeat(auto-fill, minmax(200px, 1fr))'
                     : 'none',
            }}>
            {currObjection?.items?.map(item => (
               <li
                  className={`item${`${
                     selectedItemId === item.id ? '-selected' : ''
                  }${fullScreenItemId === item.id ? '-full-screen' : ''}`}`}
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  ref={selectedItemId === item.id ? openItemRef : null}>
                  
                  {openItemId !== item.id && (
                     <div className='details-item-btns'>
                        <button
                           className='btn2'
                           onClick={() => setOpenItemId(item.id)}>
                           <BiEdit
                              style={{ fill: item.style?.color || 'black' }}
                           />
                        </button>
                        <button
                           className='btn2'
                           onClick={() => setFullScreenItemId(item.id)}>
                           full screen
                        </button>
                        <button
                           className='btn2'
                           onClick={() => setFullScreenItemId(null)}>
                           exit
                        </button>
                     </div>
                  )}
                  
                  {openItemId === item.id && (
                     <ItemEdit
                        item={item}
                        setOpenItemId={setOpenItemId}
                        currObjection={currObjection}
                        parsedContent={parsedContent}
                     />
                  )}

                  {openItemId !== item.id && (
                     <div className='item-content'>
                        <h2
                           style={{
                              color: item.style?.color || 'black',
                           }}>
                           {t(item.title)}
                        </h2>

                        <p dangerouslySetInnerHTML={{ __html: item.content }} />
                     </div>
                  )}
               </li>
            ))}
         </ul>

         <ul className='objection-details-links'>
            <button className='btn1' onClick={() => navigate('/objection')}>
               <TfiBackRight />
            </button>

            {objections.length &&
               objections.map(objection => (
                  <li
                     className='link btn2'
                     onClick={() => navigate(`/objection/details/${objection._id}`)}
                     key={objection._id}
                     style={{
                        '--bg-color-link':
                           objection._id === currObjection?._id
                              ? 'rgba(210, 210, 220, 0.4)'
                              : 'white',
                     }}>
                     {objection.category}
                  </li>
               ))}
         </ul>
      </section>
   )
}
