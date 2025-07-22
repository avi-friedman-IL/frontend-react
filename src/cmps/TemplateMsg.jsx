import { useState } from 'react'
import { socketService } from '../services/socket.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { TemplateComplexMsg } from './TemplateComplexMsg.jsx'
import { t } from 'i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
export function TemplateMsg({
   template,
   setTemplate,
   onAddMsg,
}) {
   const [msg, setMsg] = useState({})
   const user = useSelector(storeState => storeState.userModule.user)
   const navigate = useNavigate()

   function handleChange(e) {
      const { name, value } = e.target
      setMsg({ ...msg, [name]: value })
   }
   async function onSend(e) {
      e.preventDefault()
      try {
         const newMsg = {
            ...msg,
            subject: template.title,
            createdAt: Date.now(),
            from: user._id,
            fromName: user.fullname,
            isDone: false,
         }
         await onAddMsg(newMsg)
         showSuccessMsg(t('Msg sent'))
         navigate('/msg')
      } catch (err) {
         console.log('err:', err)
         showErrorMsg(t('Cannot add msg'))
      }
   }

   if (template.type === 'complex') {
      return (
         <TemplateComplexMsg
            template={template}
            setTemplate={setTemplate}
         />
      )
   }

   return (
      <form className='template-msg grid gap-1 form2' onSubmit={onSend}>
         {template.fields.map(field => (
            <div key={field.id}>
               <label className='label' htmlFor={field.id}>
                  {field.label}
               </label>
               {field.type === 'textarea' ? (
                  <textarea
                     className='textarea'
                     id={field.id}
                     name={field.name}
                     placeholder={field.label}
                     value={msg[field.name] || ''}
                     onChange={handleChange}
                     required={field.required}
                  />
               ) : (
                  <input
                     className='input'
                     type={field.type}
                     id={field.id}
                     name={field.name}
                     placeholder={field.label}
                     value={msg[field.name] || ''}
                     onChange={handleChange}
                     required={field.required}
                  />
               )}
            </div>
         ))}
         <button title={t('Send')} className='form-btn' type='submit'>
            {t('Send')}
         </button>
      </form>
   )
}
