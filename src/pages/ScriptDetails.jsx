import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { scriptService } from '../services/script'
import { useSelector } from 'react-redux'
import { loadScripts } from '../store/actions/script.actions'
import { BiEdit } from 'react-icons/bi'

import { ItemEdit } from '../cmps/ItemEdit.jsx'

export function ScriptDetails() {
   const navigate = useNavigate()
   const params = useParams()

   const scripts = useSelector(state => state.scriptModule.scripts)

   const [currScript, setCurrScript] = useState(null)
   const [openItemId, setOpenItemId] = useState(null)

   useEffect(() => {
      loadScript()
      console.log('currScript:')
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
      <section className='script-details'>
         <button className='btn' onClick={() => navigate('/script')}>
            Back
         </button>

         <ul className='script-details-main'>
            <h1>{currScript?.category}</h1>

            {currScript?.items?.map((item, idx) => (
               <li className='item' key={idx}>
                  <div className='details-item-btns'>
                     <button
                        className='btn2'
                        onClick={() => setOpenItemId(item.id)}>
                        <BiEdit />
                     </button>
                  </div>

                  {openItemId === item.id && (
                     <ItemEdit
                        item={item}
                        setOpenItemId={setOpenItemId}
                        currScript={currScript}
                     />
                  )}

                  {/* {openItemId !== item.id && ( */}
                     <div className='details-item'>
                        <h2>{item.title}</h2>
                        <p>
                           {item.content
                              .split(/\((.*?)\)/g)
                              .map((part, i) =>
                                 i % 2 === 1 ? (
                                    <span key={i}>({part})</span>
                                 ) : (
                                    part
                                 )
                              )}
                        </p>
                     </div>
                  {/* )} */}
               </li>
            ))}
         </ul>

         <ul className='script-details-links'>
            {scripts.length &&
               scripts.map(script => (
                  <li
                     className='btn'
                     onClick={() => navigate(`/script/details/${script._id}`)}
                     key={script._id}>
                     {script.category}
                  </li>
               ))}
         </ul>
      </section>
   )
}
