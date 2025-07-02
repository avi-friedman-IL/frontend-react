import { useEffect, useState } from 'react'
import { scriptService } from '../services/script'
import { addScript, getScriptById, updateScript } from '../store/actions/script.actions'
import { t } from 'i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'

export function ScriptEdit() {
   const params = useParams()
   const [script, setScript] = useState(scriptService.getEmptyScript())
   const navigate = useNavigate()
   const editorRef = useRef(null)

   useEffect(() => {
      load()
   }, [params.id])

   async function load() {
      if (params.id) {
         const script = await getScriptById(params.id)
         setScript(script)
      }
   }

   // function handleChange(ev, itemId) {
   //    const { name, value } = ev.target
   //    if (itemId) {
   //       const items = script.items.map(item => {
   //          if (item.id === itemId) item.content = value
   //          return item
   //       })
   //       setScript({ ...script, items })
   //    } else {
   //       setScript({ ...script, [name]: value })
   //    }
   // }

   function handleChange(ev) {
      const { name, value } = ev.target
      setScript(prevScript => ({ ...prevScript, [name]: value }))
   }

   function handleChangeItem(value, editor, itemId) {
      const content = editor.getContent()
      setScript(prevScript => ({
         ...prevScript,
         items: prevScript.items.map(item =>
            item.id === itemId ? { ...item, content: content } : item
         ),
      }))
   }

   async function onSaveScript(ev) {
      ev.preventDefault()
      if (!script.title) return
      try {
         if (params.id) {
            await updateScript(script)
            navigate(`/script/details/${script._id}`)
         } else {
            await addScript(script)
            navigate('/script')
         }
      } catch (err) {
         console.log('Cannot save script', err)
      }
   }

   function handleRemoveItem(itemId) {
      setScript(prevScript => ({
         ...prevScript,
         items: prevScript.items.filter(item => item.id !== itemId),
      }))
   }

   return (
      <form className='script-edit' onSubmit={onSaveScript}>
         <div className='script-header'>
            <input
               className='input'
               type='text'
               name='title'
               value={script.title}
               onChange={handleChange}
               placeholder={t('Title')}
               autoFocus
               required
            />
            <select
               className='select'
               name='gender'
               value={script.gender}
               onChange={handleChange}
               required>
               <option value=''>{t('Select Gender')}</option>
               <option value='male'>{t('male')}</option>
               <option value='female'>{t('female')}</option>
            </select>
         </div>
         {/* <div className='script-items'>
            {script.items.map(item => (
               <div key={item.id} className='script-item'>
                  <textarea
                     className='textarea'
                     name='content'
                     value={item.content}
                     onChange={ev => handleChange(ev, item.id)}
                     placeholder={t(item.title)}></textarea>
               </div>
            ))}
         </div> */}
         <div className='script-items'>
         {script.items?.map(item => (
               <div key={item.id} className='script-edit-item'>
                  <h2 className='edit-btn'>{t(item.title)}</h2>
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
                     
                  </div>
               ))}
         </div>
         <div className='form-btns'>
            <button className='form-btn'>{t('Save')}</button>
         </div>
      </form>
   )
}
