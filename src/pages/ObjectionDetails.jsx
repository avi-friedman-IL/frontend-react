import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { BiEdit } from 'react-icons/bi'
import { TfiBackRight } from 'react-icons/tfi'
import { IoCloseOutline } from 'react-icons/io5'

import { objectionService } from '../services/objection'
import { loadObjections } from '../store/actions/objection.actions'
import { ItemEdit } from '../cmps/ItemEdit.jsx'
import { ObjectionStyle } from '../cmps/ObjectionStyle.jsx'
import { AddItem } from '../cmps/AddItem.jsx'
import { t } from 'i18next'
import { AiOutlineEdit } from 'react-icons/ai'

export function ObjectionDetails() {
   const navigate = useNavigate()
   const params = useParams()

   const objections = useSelector(state => state.objectionModule.objections)

   const [currObjection, setCurrObjection] = useState(null)
   const [openItemId, setOpenItemId] = useState(null)
   const [selectedItemId, setSelectedItemId] = useState(params.itemId)
   const [isOpenAddItem, setIsOpenAddItem] = useState(false)

   const openItemRef = useRef(null)
   useEffect(() => {
      loadObjection()
   }, [params.id, objections.length, openItemId, isOpenAddItem])

   useEffect(() => {
      document.addEventListener('keydown', event => {
         if (event.key === 'Escape') {
            setSelectedItemId(null)
            setOpenItemId(null)
         }
      })
      return () => {
         document.removeEventListener('keydown', event => {
            if (event.key === 'Escape') {
               setSelectedItemId(null)
               setOpenItemId(null)
            }
         })
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

   return (
      <section className='objection-details'>
         <div
            onClick={() => {
               setSelectedItemId(null)
               setOpenItemId(null)
            }}
            className='overlay'
            style={{
               display: selectedItemId ? 'block' : 'none',
            }}></div>

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

         <ul className='objection-details-main'>
            {currObjection?.items?.map(item => (
               <li
                  className='item'
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  ref={selectedItemId === item.id ? openItemRef : null}>
                  <div
                     className={`item-content ${
                        selectedItemId === item.id ? 'selected' : ''
                     }`}>
                     {openItemId !== item.id && (
                        <div
                           className='details-item-btns'
                           style={{
                              display:
                                 selectedItemId === item.id ? 'grid' : 'none',
                           }}>
                           <button
                              className='btn2'
                              onClick={ev => {
                                 ev.stopPropagation()
                                 setSelectedItemId(null)
                              }}>
                              <IoCloseOutline />
                           </button>
                           <button
                              className='btn3'
                              onClick={() => setOpenItemId(item.id)}>
                              <span>{t('Edit')}</span>
                              <AiOutlineEdit />
                           </button>
                        </div>
                     )}

                     {openItemId === item.id && (
                        <ItemEdit
                           item={item}
                           setOpenItemId={setOpenItemId}
                           currObjection={currObjection}
                        />
                     )}

                     {openItemId !== item.id && (
                        <h2
                           className='item-title'
                           style={{
                              color: item.style?.color || 'black',
                           }}>
                           {t(item.title)}
                        </h2>
                     )}

                     {openItemId !== item.id && (
                        <p dangerouslySetInnerHTML={{ __html: item.content }} />
                     )}
                     {selectedItemId === item.id && (
                        <button
                           className='back-btn btn2'
                           onClick={() => navigate(-1)}>
                           {t('back to script')}
                           <TfiBackRight />
                        </button>
                     )}
                  </div>
               </li>
            ))}
         </ul>

         <ul className='objection-details-links'>
            <button className='back-btn btn2' onClick={() => navigate(-1)}>
               <TfiBackRight />
            </button>

            {objections.length &&
               objections.map(objection => (
                  <li
                     className='link btn1'
                     onClick={() =>
                        navigate(`/objection/details/${objection._id}`)
                     }
                     key={objection._id}
                     style={{
                        '--color-link-active':
                           objection._id === currObjection?._id
                              ? 'linear-gradient(320deg, #d87cb5 0%, #d4bbc4 100%)'
                              : 'linear-gradient(320deg, #cb1e88 0%, #cb1e5c 100%)',
                     }}>
                     {objection.category}
                  </li>
               ))}
         </ul>
      </section>
   )
}
