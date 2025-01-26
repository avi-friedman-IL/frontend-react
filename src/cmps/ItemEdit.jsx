import { useState } from 'react'
import { updateObjection } from '../store/actions/objection.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { IoCloseOutline } from 'react-icons/io5'

import { ItemStyle } from './ItemStyle.jsx'
import { TextEditor } from './TextEditor.jsx'

export function ItemEdit({ item, setOpenItemId, currObjection, parsedContent }) {
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
      const updatedItems = currObjection.items.map(currItem =>
         currItem.id === editedItem.id ? editedItem : currItem
      )
      try {
         await updateObjection({ ...currObjection, items: updatedItems })
         showSuccessMsg('Item saved successfully')
      } catch (err) {
         console.log('Cannot save item', err)
         showErrorMsg('Cannot save item')
      }

      setOpenItemId(null)
   }

   return (
      <section className='item-edit'>
         <div className='item-edit-btns'>
            <IoCloseOutline
               className='btn2'
               onClick={(ev) => {
                  ev.stopPropagation()
                  setOpenItemId(null)}}
            />

            <ItemStyle item={editedItem} setEditedItem={setEditedItem} />
         </div>
         <div className='item-edit-content'>
            <input
               type='text'
               value={editedItem.title}
               name='title'
               onChange={handleChange}
               style={{ color: editedItem.style?.color }}
            />

            <TextEditor item={editedItem} setEditedItem={setEditedItem} setOpenItemId={setOpenItemId} />
         </div>

         <button className='btn2' onClick={onSave}>
            Save
         </button>
      </section>
   )
}
