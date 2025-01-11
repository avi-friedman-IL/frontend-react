import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { BiEdit } from 'react-icons/bi'
import { TfiBackRight } from 'react-icons/tfi'

import { scriptService } from '../services/script'
import { useSelector } from 'react-redux'
import { loadScripts } from '../store/actions/script.actions'
import { ItemEdit } from '../cmps/ItemEdit.jsx'
import { ScriptStyle } from '../cmps/ScriptStyle.jsx'
import { convertToTransparent } from '../services/util.service.js'

export function ScriptDetails() {
   const navigate = useNavigate()
   const params = useParams()

   const scripts = useSelector(state => state.scriptModule.scripts)

   const [currScript, setCurrScript] = useState(null)
   const [openItemId, setOpenItemId] = useState(null)
   const [selectedItemId, setSelectedItemId] = useState(null)

   useEffect(() => {
      loadScript()
   }, [params.id, scripts.length, openItemId])

   async function loadScript() {
      try {
         if (!scripts.length) await loadScripts()
         const script = await scriptService.getById(params.id)
         setCurrScript(script)
      } catch (err) {
         console.log('Cannot load script', err)
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
         <button className='btn3' onClick={() => navigate('/script')}>
            <TfiBackRight />
         </button>

         <ScriptStyle currScript={currScript} setCurrScript={setCurrScript} />

         <h1>{currScript?.category}</h1>
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
                  className='item'
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
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
                     />
                  )}

                  {openItemId !== item.id && (
                     <div className='item-content'>
                        <h2
                           dangerouslySetInnerHTML={{ __html: item.title }}
                           style={{
                              color: item.style?.color || 'black',
                           }}
                        />
                        <p dangerouslySetInnerHTML={{ __html: item.content }} />
                     </div>
                  )}
               </li>
            ))}
         </ul>

         <ul className='script-details-links'>
            {scripts.length &&
               scripts.map(script => (
                  <li
                     className='link btn3'
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
