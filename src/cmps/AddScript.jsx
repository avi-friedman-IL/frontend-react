import { useState } from 'react'
import { scriptService } from '../services/script'
import { updateScript } from '../store/actions/script.actions'
import { t } from 'i18next'
import { MdClose } from 'react-icons/md'

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
      setIsOpen(false)
      try {
         await updateScript(script)
      } catch (err) {
         console.log('Cannot save script', err)
      }
   }

   return (
      // <section className='add-script'>
      <form className='form2 form3' onSubmit={onSaveScript}>
         <textarea
            name='title'
            value={script.title}
            onChange={handleChange}
            placeholder={t('Title')}
            autoFocus
            ></textarea>

         {script.items.map(item => (
            <div key={item.id}>
               <textarea
                  name='content'
                  // cols={100}
                  // rows={5}
                  value={item.content}
                  onChange={ev => handleChange(ev, item.id)}
                  placeholder={t(item.title)}></textarea>
            </div>
         ))}
         <div className='form-btns'>
            <button className='form-btn'>{t('Save')}</button>
            <button type='button' className='close-btn' onClick={() => setIsOpen(false)}>
               <MdClose />
            </button>
         </div>
      </form>
      // </section>
   )
}
