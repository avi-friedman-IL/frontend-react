import { useState } from 'react'
import { addObjection } from '../store/actions/objection.actions'
import { objectionService } from '../services/objection'
import { makeId } from '../services/util.service'
import { t } from 'i18next'

export function AddObjection({ setIsOpen }) {
   const [currObjection, setCurrObjection] = useState(
      objectionService.getEmptyObjection()
   )

   function addItem(ev) {
      ev.preventDefault()
      setCurrObjection(prevState => ({
         ...prevState,
         items: [...prevState.items, { title: '', content: '' }],
      }))
   }

   function handleChange(ev) {
      const { name, value } = ev.target
      setCurrObjection(prevState => ({
         ...prevState,
         [name]: value,
      }))
   }

   function handleChangeItem(ev, id) {
      const { name, value } = ev.target
      const updatedItems = currObjection.items.map((item, idx) =>
         item.id === id ? { ...item, id: makeId(), [name]: value } : item
      )
      setCurrObjection(prevState => ({
         ...prevState,
         items: updatedItems,
      }))
   }
   async function onSave(ev) {
      ev.preventDefault()
      setIsOpen(false)
      try {
         await addObjection(currObjection)
      } catch (err) {
         console.log('Cannot save objection', err)
      }
   }
   const { category, items } = currObjection
   return (
      <form className='form1'>
         <input
            type='text'
            name='category'
            placeholder={t('category')}
            value={category}
            onChange={handleChange}
         />

         <button className='btn2' onClick={addItem}>
            {t('add item')}
         </button>
         <ul className='add-objection-items'>
            {items?.map((item, idx) => (
               <li className='item' key={idx}>
                  <input
                     type='text'
                     name='title'
                     placeholder={t('title')}
                     value={item.title}
                     onChange={ev => handleChangeItem(ev, item.id)}
                  />
                  <textarea
                     name='content'
                     rows={5}
                     placeholder={t('content')}
                     value={item.content ? item.content : ''}
                     onChange={ev => handleChangeItem(ev, item.id)}></textarea>
               </li>
            ))}
         </ul>
         <div className='form-btns'>
            <button className='btn2' onClick={onSave}>
               {t('save')}
            </button>
            <button className='btn2' onClick={() => setIsOpen(false)}>
               {t('cancel')}
            </button>
         </div>
      </form>
   )
}
