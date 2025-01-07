import { useState } from 'react'
import { loadScripts, updateScript } from '../store/actions/script.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { IoCloseOutline } from 'react-icons/io5'

export function ItemEdit({ item, setOpenItemId, currScript }) {
   const [editedItem, setEditedItem] = useState(item)

   function handleChange(ev) {
      const { name, value } = ev.target
      setEditedItem(prevState => ({
         ...prevState,
         [name]: value,
      }))
   }

   async function onSave(ev) {
      ev.preventDefault()
      const updatedItems = currScript.items.map(currItem =>
         currItem.id === editedItem.id ? editedItem : currItem
      )
      try {
         await updateScript({ ...currScript, items: updatedItems })
         showSuccessMsg('Item saved successfully')
      } catch (err) {
         console.log('Cannot save item', err)
         showErrorMsg('Cannot save item')
      }

      setOpenItemId(null)
   }

   return (
      <section className='item-edit'>
         <div className='button-wrap'>
            <button
               className='btn2 cancel-btn'
               onClick={() => setOpenItemId(null)}>
              <IoCloseOutline />
            </button>
         </div>
         <input
            type='text'
            value={editedItem.title}
            name='title'
            onChange={handleChange}
         />
         <textarea
            type='text'
            value={editedItem.content}
            name='content'
            onChange={handleChange}
            rows={5}></textarea>
         <button className='btn' onClick={onSave}>
            Save
         </button>
      </section>
   )
}
