import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { templateService } from '../services/template'
import { makeId } from '../services/util.service'
import { t } from 'i18next'
import { addTemplate } from '../store/actions/template.actions'

export function TemplateEdit() {
   const params = useParams()
   const navigate = useNavigate()
   const [template, setTemplate] = useState({
      title: '',
      fields: [
         {
            id: makeId(),
            name: '',
            label: '',
            type: '',
            required: true,
         },
      ],
   })

   useEffect(() => {
      loadTemplate()
   }, [params.id])

   async function loadTemplate() {
      try {
         if (params.id) {
            const template = await templateService.getById(params.id)
            setTemplate(template)
         }
      } catch (err) {
         console.log('err', err)
      }
   }

   function handleChange(ev) {
      const type = ev.target.type
      const id = ev.target.id
      const field = ev.target.name
      const value = type === 'checkbox' ? ev.target.checked : ev.target.value
      const dataType = ev.target.getAttribute('data-type')

      if (dataType === 'subField') {
         setTemplate({
            ...template,
            fields: template.fields.map(f =>
               f.id === id ? { ...f, [field]: value, label: f.name } : f
            ),
         })
      } else {
         setTemplate({ ...template, [field]: value })
      }
   }

   async function handleSubmit(ev) {
      ev.preventDefault()
      try {
         await addTemplate(template)
         navigate(-1)
      } catch (err) {
         console.log('err', err)
      }
   }

   function onAddField(ev) {
      ev.preventDefault()
      const newField = {
         id: makeId(),
         name: '',
         label: '',
         type: '',
         required: true,
      }
      setTemplate({ ...template, fields: [...template.fields, newField] })
   }

   function onRemoveField(fieldId) {
      setTemplate({
         ...template,
         fields: template.fields.filter(field => field.id !== fieldId),
      })
   }

   return (
      <form className='template-edit' onSubmit={handleSubmit}>
         <input
            className='input'
            type='text'
            placeholder={t('Subject')}
            name='title'
            value={template.title}
            onChange={handleChange}
         />

         <h2>{t('fields')}:</h2>
         <div className='fields'>
            {template.fields.map(field => (
               <div key={field.id} className='field grid gap-1'>
                  <label htmlFor=''>
                     {t('label')}
                     <input
                        className='input'
                        data-type='subField'
                        id={field.id}
                        type='text'
                        placeholder={t('label')}
                        name='name'
                        value={field.name}
                        onChange={handleChange}
                     />
                  </label>
                  <select
                     className='input'
                     data-type='subField'
                     id={field.id}
                     name='type'
                     value={field.type}
                     onChange={handleChange}>
                     <option value=''>{t('select type of field')}</option>
                     <option value='text'>{t('text')}</option>
                     <option value='number'>{t('number')}</option>
                     <option value='textarea'>{t('textarea')}</option>
                  </select>
                  <label htmlFor='' className='grid-col align-center'>
                     <input
                        className='input'
                        data-type='subField'
                        id={field.id}
                        type='checkbox'
                        name='required'
                        checked={field.required}
                        onChange={handleChange}
                     />
                     {field.required && t('Required field')}
                     {!field.required && t('Not required field')}
                  </label>
                  <button
                     className='form-btn'
                     onClick={() => onRemoveField(field.id)}>
                     {t('Remove field')}
                  </button>
               </div>
            ))}
            <button className='form-btn' onClick={onAddField}>
               {t('Add field')}
            </button>
         </div>
         <button type='submit' className='form-btn'>
            {t('Save')}
         </button>
      </form>
   )
}
