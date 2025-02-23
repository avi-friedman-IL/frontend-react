import { t } from 'i18next'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { loadScripts } from '../store/actions/script.actions'
import { scriptService } from '../services/script'
import { ObjectionIndex } from './ObjectionIndex'
import { TipsIndex } from './TipsIndex.jsx'
import { BiEdit } from 'react-icons/bi'
import { ItemEdit } from '../cmps/ItemEdit.jsx'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdTextDecrease, MdTextIncrease } from 'react-icons/md'
import { Tooltip } from '../cmps/Tooltip.jsx'

export function ScriptDetails() {
   const params = useParams()
   const timeoutRef = useRef(null)

   const [script, setScript] = useState(null)
   const [fontSize, setFontSize] = useState(24)
   const [openItemId, setOpenItemId] = useState(null)
   const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
   const [tooltipText, setTooltipText] = useState('')
   const [isTooltipOpen, setIsTooltipOpen] = useState(false)

   useEffect(() => {
      loadScript()
   }, [params.id, openItemId])

   async function loadScript() {
      try {
         const script = await scriptService.getById(params.id)
         setScript(script)
      } catch (err) {
         console.log('Cannot load script', err)
      }
   }

   function handleMouseEnter(ev) {
      ev.preventDefault()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
         setIsTooltipOpen(true)
         setTooltipPos({ x: ev.pageX + 10, y: ev.pageY - 10 })
      }, 300)
   }

   function handleMouseLeave() {
      clearTimeout(timeoutRef.current)
      setIsTooltipOpen(false)
   }

   if (!script) return <div>Loading...</div>
   return (
      <section className='script-details'>
         {isTooltipOpen && <Tooltip text={tooltipText} position={tooltipPos} />}
         <TipsIndex />
         
         <ul className='items'>
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
         <ul className='script-details-btns'>
            <button
               ref={timeoutRef}
               className='btn1'
               onClick={() => setFontSize(fontSize => (fontSize += 5))}
               onMouseEnter={ev => {
                  setTooltipText(t('Increase text'))
                  handleMouseEnter(ev)
               }}
               onMouseLeave={handleMouseLeave}>
               <MdTextIncrease />
            </button>
            <button
               ref={timeoutRef}
               className='btn1'
               onClick={() => setFontSize(fontSize => (fontSize -= 5))}
               onMouseEnter={ev => {
                  setTooltipText(t('Decrease text'))
                  handleMouseEnter(ev)
               }}
               onMouseLeave={handleMouseLeave}>
               <MdTextDecrease />
            </button>
         </ul>
         <ObjectionIndex />
      </section>
   )
}
