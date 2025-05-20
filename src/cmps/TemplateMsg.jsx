import { useState } from 'react'
import { socketService } from '../services/socket.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { TemplateComplexMsg } from './TemplateComplexMsg.jsx'
import { t } from 'i18next'
import { useSelector } from 'react-redux'
export function TemplateMsg({ template, setTemplate, setIsShowTemplate }) {
   const [msg, setMsg] = useState({})
   const user = useSelector(storeState => storeState.userModule.user)

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
         socketService.emit('msg-add', newMsg)
         showSuccessMsg(t('Msg sent'))
         // setTemplate(null)
         setIsShowTemplate(false)
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
            setIsShowTemplate={setIsShowTemplate}
         />
      )
   }

   return (
      <form className='template-msg grid gap-1' onSubmit={onSend}>
         {template.fields.map(field => (
            <div key={field.id}>
               <label htmlFor={field.id}>{field.label}</label>
               {field.type === 'textarea' ? (
                  <textarea
                     id={field.id}
                     name={field.name}
                     placeholder={field.label}
                     value={msg[field.name] || ''}
                     onChange={handleChange}
                     required={field.required}
                  />
               ) : (
                  <input
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
