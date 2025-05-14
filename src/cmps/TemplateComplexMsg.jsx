import { t } from 'i18next'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { socketService } from '../services/socket.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'


export function TemplateComplexMsg({
   template,
   setTemplate,
   setIsShowTemplate,
}) {
   const user = useSelector(storeState => storeState.userModule.user)
   const [status, setStatus] = useState(null)
   const [fields, setFields] = useState([])
   const [msg, setMsg] = useState({})
   function handleChangeStatus(ev) {
      setStatus(ev.target.value)
      setMsg({ ...msg, category: ev.target.value })
   }
   function handleChange(ev) {
      const { name, value } = ev.target
      setMsg({ ...msg, [name]: value })
   }
   function onSend() {
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
         setTemplate(null)
         setIsShowTemplate(false)
      } catch (err) {
         console.log('err:', err)
         showErrorMsg(t('Cannot add msg'))
      }
   }

   useEffect(() => {
      if (status) {
         setFields(
            template.statuses.find(currStatus => status === currStatus.name)
               ?.fields || []
         )
      }
   }, [status])

   return (
      <section className='template-complex-msg grid gap-1'>
         <select onChange={handleChangeStatus} value={template.status}>
            <option value=''>{t('Select category')}</option>
            {template.statuses.map(status => (
               <option key={status.name} value={status.name}>
                  {status.name}
               </option>
            ))}
         </select>
         {status && (
            <div className='fields'>
               <label htmlFor='phone'>{t('Phone number')}</label>
               <input type='text' name='phone'
                  placeholder={t('Phone number')}
                  value={msg.phone || ''}
                  onChange={handleChange}
               />
               <label htmlFor='collection'>{t('collection name')}</label>
               <input type='text' name='collection'
                  placeholder={t('collection name')}
                  value={msg.collection || ''}
                  onChange={handleChange}
               />
               {fields.length > 0 &&
                  fields.map(field => (
                     <div key={field.id}>
                        <label htmlFor={field.id}>{field.label}</label>
                        {field.type === 'textarea' ? (
                           <textarea
                              id={field.id}
                              name={field.name}
                              placeholder={field.label}
                              value={msg[field.name] || ''}
                              onChange={handleChange}
                           />
                        ) : (
                           <input
                              type={field.type}
                              id={field.id}
                              name={field.name}
                              placeholder={field.label}
                              value={msg[field.name] || ''}
                              onChange={handleChange}
                           />
                        )}
                     </div>
                  ))}
            </div>
         )}
         <button title={t('Send')} className='form-btn' onClick={onSend}>
            {t('Send')}
         </button>
      </section>
   )
}
