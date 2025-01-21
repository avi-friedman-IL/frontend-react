import { useState } from 'react'
import { makeId } from '../services/util.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { updateScript } from '../store/actions/script.actions'
import { t } from 'i18next'

export function AddItem({ currScript, setCurrScript, setIsOpenAddItem }) {
   const [newItem, setNewItem] = useState({
      id: makeId(),
      title: '',
      content: '',
      style: { color: '#000000' },
   })

   function handleChange(ev) {
      const { name, value } = ev.target
      setNewItem(prevState => ({
         ...prevState,
         [name]: value,
      }))
   }

   async function onSave(ev) {
      ev.preventDefault()
      const updatedItems = [...currScript.items, newItem]
      try {
         await updateScript({ ...currScript, items: updatedItems })
         showSuccessMsg('Item added successfully')
      } catch (err) {
         console.log('Cannot add item', err)
         showErrorMsg('Cannot add item')
      }
      setIsOpenAddItem(false)
   }

   return (
      <form onSubmit={onSave} className='add-item-form'>
         <input
            type='text'
            value={newItem.title}
            name='title'
            onChange={handleChange}
            placeholder={t('title')}
         />
         <textarea
            type='text'
            value={newItem.content}
            name='content'
            onChange={handleChange}
            placeholder={t('content')}></textarea>
         <div className='form-btns'>
            <button className='btn2'>{t('add')}</button>
            <button className='btn2' onClick={() => setIsOpenAddItem(false)}>
               {t('cancel')}
            </button>
         </div>
      </form>
   )
}
