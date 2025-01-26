// import { useEffect, useState } from 'react'
// import { objectionService } from '../services/objection'
// import {
//    addObjection,
//    getObjectionById,
//    loadObjections,
//    updateObjection,
// } from '../store/actions/objection.actions'
// import { useNavigate, useParams } from 'react-router'
// import { makeId } from '../services/util.service'
// import { TextEditor } from '../cmps/TextEditor'

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { addObjection } from '../store/actions/objection.actions'
import { objectionService } from '../services/objection'
import { makeId } from '../services/util.service'
import { t } from 'i18next'

// export function ObjectionEdit() {
//    const params = useParams()
//    const navigate = useNavigate()
//    const [currObjection, setCurrObjection] = useState(objectionService.getEmptyObjection())

//    useEffect(() => {
//       params.id ? objectionToEdit() : objectionService.getEmptyObjection()
//    }, [params.id, objectionService])

//    async function objectionToEdit() {
//       try {
//          const objection = await getObjectionById(params.id)
//          if (objection) setCurrObjection(objection)
//          return objection
//       } catch (err) {
//          console.log('Cannot get objection', err)
//       }
//    }

//    function addItem(ev) {
//       ev.preventDefault()
//       setCurrObjection(prevState => ({
//          ...prevState,
//          items: [...prevState.items, { title: '', content: '' }],
//       }))
//    }

//    function handleChange(ev) {
//       const { name, value } = ev.target
//       setCurrObjection(prevState => ({
//          ...prevState,
//          [name]: value,
//       }))
//    }

//    function handleChangeItem(ev, id) {
//       const { name, value } = ev.target
//       const updatedItems = currObjection.items.map((item, idx) =>
//          item.id === id ? { ...item, id: makeId(), [name]: value } : item
//       )
//       setCurrObjection(prevState => ({
//          ...prevState,
//          items: updatedItems,
//       }))
//    }
//    async function onSave(ev) {
//       ev.preventDefault()
//       try {
//          params.id
//             ? await updateObjection(currObjection)
//             : await addObjection(currObjection)
//          navigate('/objection')
//       } catch (err) {
//          console.log('Cannot save objection', err)
//       }
//    }
//    if (!currObjection) return <div>Loading...</div>
//    const { category, items } = currObjection
//    return (
//       <form className='objection-edit'>
//          <input
//             type='text'
//             name='category'
//             placeholder='category'
//             value={category}
//             onChange={handleChange}
//          />

//          <button className='btn' onClick={addItem}>
//             Add Item
//          </button>
//          <ul className='objection-edit-items'>
//             {items?.map((item, idx) => (
//                <li className='item' key={idx}>
//                   <input
//                      type='text'
//                      name='title'
//                      placeholder='title'
//                      value={item.title}
//                      onChange={ev => handleChangeItem(ev, item.id)}
//                   />
//                      <TextEditor value={item.content ? item.content : ''} />
//                   {/* <textarea
//                      name='content'
//                      rows={5}
//                      placeholder='content'
//                      value={item.content ? item.content : ''}
//                      onChange={ev => handleChangeItem(ev, item.id)}>
//                      </textarea> */}
//                </li>
//             ))}
//          </ul>
//          <div className='save-and-cancel'>
//             <button className='btn' onClick={onSave}>
//                Save
//             </button>
//             <button className='btn' onClick={() => navigate('/objection')}>
//                Cancel
//             </button>
//          </div>
//       </form>
//    )
// }
export function AddObjection({ setIsOpen }) {
   const [currObjection, setCurrObjection] = useState(objectionService.getEmptyObjection())

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
      try {
         await addObjection(currObjection)
         setIsOpen(false)
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
                     onChange={ev => handleChangeItem(ev, item.id)}>
                     </textarea>
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
