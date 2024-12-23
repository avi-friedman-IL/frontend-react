import { useEffect, useState } from 'react'
import { scriptService } from '../services/script'
import {
   addScript,
   getScriptById,
   loadScripts,
   updateScript,
} from '../store/actions/script.actions'
import { useNavigate, useParams } from 'react-router'
import { makeId } from '../services/util.service'

export function ScriptEdit() {
   const params = useParams()
   const navigate = useNavigate()
   const [currScript, setCurrScript] = useState(scriptService.getEmptyScript())

   useEffect(() => {
      params.id ? scriptToEdit() : scriptService.getEmptyScript()
   }, [params.id, scriptService])

   async function scriptToEdit() {
      try {
         const script = await getScriptById(params.id)
         if (script) setCurrScript(script)
         return script
      } catch (err) {
         console.log('Cannot get script', err)
      }
   }

   function addItem(ev) {
      ev.preventDefault()
      setCurrScript(prevState => ({
         ...prevState,
         items: [...prevState.items, { title: '', content: '' }],
      }))
   }

   function handleChange(ev) {
      const { name, value } = ev.target
      setCurrScript(prevState => ({
         ...prevState,
         [name]: value,
      }))
   }

   function handleChangeItem(ev, id) {
      const { name, value } = ev.target
      const updatedItems = currScript.items.map((item, idx) =>
         item.id === id ? { ...item, id: makeId(), [name]: value } : item
      )
      setCurrScript(prevState => ({
         ...prevState,
         items: updatedItems,
      }))
   }
   async function onSave(ev) {
      ev.preventDefault()
      try {
         params.id
            ? await updateScript(currScript)
            : await addScript(currScript)
         navigate('/script')
      } catch (err) {
         console.log('Cannot save script', err)
      }
   }
   if (!currScript) return <div>Loading...</div>
   const { category, items } = currScript
   return (
      <form className='script-edit'>
         <input
            type='text'
            name='category'
            placeholder='category'
            value={category}
            onChange={handleChange}
         />

         <button className='btn' onClick={addItem}>
            Add Item
         </button>
         <ul className='script-edit-items'>
            {items?.map((item, idx) => (
               <li className='item' key={idx}>
                  <input
                     type='text'
                     name='title'
                     placeholder='title'
                     value={item.title}
                     onChange={ev => handleChangeItem(ev, item.id)}
                  />
                  <textarea
                     name='content'
                     rows={5}
                     placeholder='content'
                     value={item.content ? item.content : ''}
                     onChange={ev => handleChangeItem(ev, item.id)}></textarea>
               </li>
            ))}
         </ul>
         <div className='save-and-cancel'>
            <button className='btn' onClick={onSave}>
               Save
            </button>
            <button className='btn' onClick={() => navigate('/script')}>
               Cancel
            </button>
         </div>
      </form>
   )
}
