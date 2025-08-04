import { useEffect, useState } from 'react'
import { objectionService } from '../services/objection'
import {
   addObjection,
   getObjectionById,
   updateObjection,
} from '../store/actions/objection.actions'
import { t } from 'i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'
import { makeId } from '../services/util.service'

export function ObjectionEdit() {
   const params = useParams()
   const [objection, setObjection] = useState(
      objectionService.getEmptyObjection()
   )
   const navigate = useNavigate()
   const editorRef = useRef(null)

   useEffect(() => {
      load()
   }, [params.id])

   async function load() {
      if (params.id) {
         const objection = await getObjectionById(params.id)
         setObjection(objection)
      }
   }

   function handleChange(ev) {
      const { name, value } = ev.target
      setObjection(prevObjection => ({ ...prevObjection, [name]: value }))
   }

   function handleChangeItem(value, editor, itemId) {
      const content = editor.getContent()
      setObjection(prevObjection => ({
         ...prevObjection,
         items: prevObjection.items.map(item =>
            item.id === itemId ? { ...item, content: content } : item
         ),
      }))
   }

   async function onSaveObjection(ev) {
      ev.preventDefault()
      if (!objection.category) return
      try {
         if (params.id) {
            await updateObjection(objection)
            navigate(`/objection/details/${objection._id}`)
         } else {
            await addObjection(objection)
            navigate('/objection')
         }
      } catch (err) {
         console.log('Cannot save objection', err)
      }
   }

   function handleRemoveItem(itemId) {
      setObjection(prevObjection => ({
         ...prevObjection,
         items: prevObjection.items.filter(item => item.id !== itemId),
      }))
   }

   function handleAddItem() {
      setObjection(prevObjection => ({
         ...prevObjection,
         items: [
            ...prevObjection.items,
            { id: makeId(), content: '', title: '' },
         ],
      }))
   }

   function handleChangeItemTitle(ev, itemId) {
      const { name, value } = ev.target
      setObjection(prevObjection => ({
         ...prevObjection,
         items: prevObjection.items.map(itm =>
            itm.id === itemId ? { ...itm, [name]: value } : itm
         ),
      }))
   }

   return (
      <form className='objection-edit' onSubmit={onSaveObjection}>
         <div className='objection-header'>
            <input
               className='input'
               type='text'
               name='category'
               value={objection.category}
               onChange={handleChange}
               placeholder={t('Category')}
               autoFocus
               required
            />
            <select
               className='select'
               name='gender'
               value={objection.gender}
               onChange={handleChange}
               required>
               <option value=''>{t('Select Gender')}</option>
               <option value='male'>{t('male')}</option>
               <option value='female'>{t('female')}</option>
            </select>
            <button className='edit-btn' onClick={handleAddItem}>
               {t('Add Item')}
            </button>
         </div>
         <div className='objection-items'>
            {objection.items?.map(item => (
               <div key={item.id} className='objection-edit-item'>
                  <input
                     className='input'
                     type='text'
                     name='title'
                     value={item.title}
                     onChange={ev => handleChangeItemTitle(ev, item.id)}
                     placeholder={t('Title')}
                     required
                  />
                  <Editor
                     className='tox'
                     apiKey='4t0jqmbiio9yuhkttljns4bgklv2e5783neoz12pg40tqje8'
                     onInit={(evt, editor) => {
                        editorRef.current = editor
                     }}
                     initialValue={item.content}
                     init={{
                        language: 'he_IL',
                        directionality: 'rtl',
                        menubar: false,
                        skin: 'oxide',
                        content_css: '/src/assets/style/cmps/_tox.scss',
                        toolbar:
                           'fontsize | forecolor backcolor | removeformat',
                        branding: false,
                        resize: false,
                     }}
                     onBlur={(value, editor, itemId) =>
                        handleChangeItem(value, editor, item.id)
                     }
                     editorRef={editorRef}
                  />
                  <button
                     className='delete-btn'
                     onClick={() => handleRemoveItem(item.id)}>
                     {t('Remove')}
                  </button>
               </div>
            ))}
         </div>
         <div className='form-btns'>
            <button type='submit' className='form-btn'>
               {t('Save')}
            </button>
         </div>
      </form>
   )
}
