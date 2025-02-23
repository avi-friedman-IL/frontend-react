import { useState } from 'react'
import { scriptService } from '../services/script'
import { updateScript } from '../store/actions/script.actions'
import { t } from 'i18next'

export function AddScript({ setIsOpen }) {
   const [script, setScript] = useState(scriptService.getEmptyScript())

   function handleChange(ev, itemId) {
      const { name, value } = ev.target
      if (itemId) {
         const items = script.items.map(item => {
            if (item.id === itemId) item.content = value
            return item
         })
         setScript({ ...script, items })
      } else {
         setScript({ ...script, [name]: value })
      }
   }

   async function onSaveScript(ev) {
      ev.preventDefault()
      if (!script.title) return
      try {
         await updateScript(script)
         setIsOpen(false)
      } catch (err) {
         console.log('Cannot save script', err)
      }
   }

   return (
      // <section className='add-script'>
         <form className='form1' onSubmit={onSaveScript}>
            <textarea
               name='title'
               value={script.title}
               onChange={handleChange}
               placeholder={t('Title')}></textarea>

            {script.items.map(item => (
               <div key={item.id}>
                  <textarea
                     name='content'
                     cols={300}
                     rows={5}
                     value={item.content}
                     onChange={ev => handleChange(ev, item.id)}
                     placeholder={t(item.title)}></textarea>
               </div>
            ))}
            <div className='form-btns'>
               <button className='btn2'>{t('Save')}</button>
               <button className='btn2' onClick={() => setIsOpen(false)}>{t('Cancel')}</button>
            </div>
         </form>
      // </section>
   )
}
