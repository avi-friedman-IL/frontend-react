import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { scriptService } from '../services/script'
import { useSelector } from 'react-redux'
import { loadScripts } from '../store/actions/script.actions'

export function ScriptDetails() {
   const params = useParams()
   const navigate = useNavigate()
   const scripts = useSelector(state => state.scriptModule.scripts)
   const [currScript, setCurrScript] = useState(null)

   useEffect(() => {
      loadScript()
   }, [params.id, scripts.length])

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
               <li key={idx}>
                  <h2>{item.title}</h2>
                  <p>
                     {item.content
                        .split(/\((.*?)\)/g)
                        .map((part, i) =>
                           i % 2 === 1 ? <span key={i}>({part})</span> : part
                        )}
                  </p>
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
