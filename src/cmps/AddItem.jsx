import { useState } from 'react'
import { makeId } from '../services/util.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { updateObjection } from '../store/actions/objection.actions'
import { t } from 'i18next'

export function AddItem({ currObjection, setCurrObjection, setIsOpenAddItem }) {
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
      setIsOpenAddItem(false)
      const updatedItems = [...currObjection.items, newItem]
      try {
         await updateObjection({ ...currObjection, items: updatedItems })
         showSuccessMsg(t('Item added successfully'))
      } catch (err) {
         console.log('Cannot add item', err)
         showErrorMsg(t('Cannot add item'))
      }
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
