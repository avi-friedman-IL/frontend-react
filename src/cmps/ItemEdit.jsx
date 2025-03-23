import { useState } from 'react'
import { updateObjection } from '../store/actions/objection.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { IoCloseOutline } from 'react-icons/io5'
import { t } from 'i18next'

import { ItemStyle } from './ItemStyle.jsx'
import { TextEditor } from './TextEditor.jsx'
import { updateScript } from '../store/actions/script.actions.js'

export function ItemEdit({ item, setOpenItemId, currObjection }) {
   const [editedItem, setEditedItem] = useState(item)

   function handleChange(ev) {
      const { name, value } = ev.target
      setEditedItem(prevState => ({
         ...prevState,
         [name]: value,
      }))
   }

   async function onSave(ev) {
      ev.stopPropagation()
      ev.preventDefault()
      setOpenItemId(null)
      const updatedItems = currObjection.items.map(currItem =>
         currItem.id === editedItem.id ? editedItem : currItem
      )
      try {
         currObjection.title
            ? await updateScript({ ...currObjection, items: updatedItems })
            : await updateObjection({ ...currObjection, items: updatedItems })
         showSuccessMsg(t('Item saved successfully'))
      } catch (err) {
         console.log('Cannot save item', err)
         showErrorMsg(t('Cannot save item'))
      }

   }

   return (
      <section className='item-edit'>
         <div className='item-edit-btns'>
            <IoCloseOutline
               className='btn2'
               onClick={ev => {
                  ev.stopPropagation()
                  setOpenItemId(null)
               }}
            />

            <ItemStyle item={editedItem} setEditedItem={setEditedItem} />
         </div>
         <div className='item-edit-content'>
            <textarea
               className='item-title'
               type='text'
               value={editedItem.title}
               name='title'
               onChange={handleChange}
               style={{ color: editedItem.style?.color }}
            />

            <TextEditor
               item={editedItem}
               setEditedItem={setEditedItem}
               setOpenItemId={setOpenItemId}
            />
         </div>

         <button className='btn2' onClick={onSave}>
            Save
         </button>
      </section>
   )
}
