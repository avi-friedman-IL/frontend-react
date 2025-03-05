import { useState, useEffect } from 'react'
import { msgService } from '../services/msg'
import { t } from 'i18next'
import { socketService } from '../services/socket.service'
import { MdClose } from 'react-icons/md'

export function NewMsg({ users, loggedinUser, setIsOpenNewMsg }) {
   const [msg, setMsg] = useState(msgService.getEmptyMsg())
   const subjects = msgService.getSubjects()
   const [currSubject, setCurrSubject] = useState('')
   const [currSubjectFields, setCurrSubjectFields] = useState([])
   const [complexFields, setComplexFields] = useState([])
   const [send, setSend] = useState(false)

   useEffect(() => {
      if (currSubject === 'שיחה לא מזוהה') {
         setComplexFields([])
         setCurrSubjectFields([])
      } else {
         setCurrSubjectFields(
            subjects?.find(subject => subject.title === currSubject)?.fields
         )
      }
   }, [currSubject])

   function handleChange(ev) {
      const field = ev.target.name
      var value = ev.target.value
      if (field === 'subject') {
         setCurrSubject(value)
      }

      if (field === 'status') {
         if (value === '1' || value === '2') {
            setComplexFields([])
            setSend(true)
         }
         if (value === '3') {
            var complexFields = subjects
               ?.find(subject => subject.title === currSubject)
               ?.fields.slice(2, -1)
            setComplexFields(complexFields)
            setSend(true)
         }
         if (value === '4') {
            var complexFields = subjects
               ?.find(subject => subject.title === currSubject)
               ?.fields.slice(0, 2)
            setComplexFields(complexFields)
            setSend(true)
         }
         if (value === '1') {
            value = 'סירוב'
         }
         if (value === '2') {
            value = 'לא עניתי'
         }
         if (value === '3') {
            value = 'תרומה'
         }
         if (value === '4') {
            value = 'המשך טיפול'
         }
      }
      setMsg({
         ...msg,
         [field]: value,
         from: loggedinUser._id,
         fromName: loggedinUser.fullname,
      })
   }

   async function onAddMsg(ev) {
      ev.preventDefault()
      const newMsg = { ...msg, createdAt: Date.now() }
      setIsOpenNewMsg(false)
      try {
         socketService.emit('msg-add', newMsg)
      } catch (err) {
         console.log('err:', err)
      }
   }

   return (
      <form className='new-msg-form' onSubmit={onAddMsg}>
         <select name='subject' id='subject' onChange={handleChange} required>
            <option value=''>{t('Subject')}:</option>
            {subjects.map(subject => (
               <option key={subject.id} value={subject.title}>
                  {t(subject.title)}
               </option>
            ))}
         </select>

         {currSubject === 'שיחה לא מזוהה' && (
            <div className='field-container'>
               <input
                  type='text'
                  name='collection'
                  placeholder='שם המגבית'
                  onChange={handleChange}
                  value={msg.collection || ''}
                  required
               />
               <input
                  type='tel'
                  name='phone'
                  placeholder='מס הטלפון'
                  onChange={handleChange}
                  value={msg.phone || ''}
                  required
               />
               <select
                  name='status'
                  id='status'
                  onChange={handleChange}
                  required>
                  <option value=''>{t('Status')}:</option>
                  <option value='1'>סירוב</option>
                  <option value='2'>לא עניתי</option>
                  <option value='3'>תרומה</option>
                  <option value='4'>המשך טיפול</option>
               </select>
               {complexFields?.length > 0 && (
                  <div className='field-container'>
                     {complexFields.map(field => (
                        <input
                           key={field.name}
                           type={field.type}
                           name={field.name}
                           placeholder={field.label}
                           onChange={handleChange}
                           value={msg[field.name] || ''}
                           required={field.required}
                        />
                     ))}
                  </div>
               )}
               <div className='btn-container'>
                  {send && (
                     <button type='submit' className='send-btn'>
                        {t('send')}
                     </button>
                  )}
               </div>
            </div>
         )}

         {currSubjectFields?.length > 0 && (
            <div className='field-container'>
               {currSubjectFields.map(field => (
                  <div className='field-container' key={field.label}>
                     {field.type === 'textarea' ? (
                        <textarea
                           className={`field-input`}
                           name={field.name}
                           placeholder={field.label}
                           value={msg[field.name] || ''}
                           onChange={handleChange}
                           required={field.required}
                        />
                     ) : (
                        <label htmlFor={field.label}>
                           {field.label}
                           <input
                              className={`field-input`}
                              type={field.type}
                              name={field.name}
                              placeholder={field.label}
                              value={msg[field.name] || ''}
                              onChange={handleChange}
                              required={field.required}
                           />
                        </label>
                     )}
                  </div>
               ))}
               <div className='btn-container'>
                  <button type='submit' className='send-btn'>
                     {t('send')}
                  </button>
               </div>
            </div>
         )}

         <div className='form-btns'>
            <button
               type='button'
               className='close-btn'
               onClick={() => setIsOpenNewMsg(false)}>
               <MdClose />
            </button>
         </div>
      </form>
   )
}
