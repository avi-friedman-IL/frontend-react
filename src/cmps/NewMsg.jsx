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
   const [currFieldIdx, setCurrFieldIdx] = useState(0)
   const [animationState, setAnimationState] = useState('entering')

   useEffect(() => {
      setCurrSubjectFields(
         subjects?.find(subject => subject.title === currSubject)?.fields
      )
      setCurrFieldIdx(0)
   }, [currSubject])

   function handleChange(ev) {
      const field = ev.target.name
      const value = ev.target.value
      if (field === 'subject') {
         setCurrSubject(value)
      }
      setMsg({
         ...msg,
         [field]: value,
         from: loggedinUser._id,
      })
   }

   function handleNext(ev) {
      ev.preventDefault()
      if (currFieldIdx < currSubjectFields.length - 1) {
         setAnimationState('exiting')
         setTimeout(() => {
            setCurrFieldIdx(prevIdx => prevIdx + 1)
            setAnimationState('entering')
         }, 500) // Match this with the animation duration in SCSS
      }
   }

   function handlePrev(ev) {
      ev.preventDefault()
      if (currFieldIdx > 0) {
         setAnimationState('exiting')
         setTimeout(() => {
            setCurrFieldIdx(prevIdx => prevIdx - 1)
            setAnimationState('entering')
         }, 500) // Match this with the animation duration in SCSS
      }
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
         {/* <select name='to' id='to' onChange={handleChange} required>
            <option value=''>{t('To')}:</option>
            {users.map(user => (
               <option key={user._id} value={user._id}>
                  {user.fullname}
               </option>
            ))}
         </select> */}

         <select name='subject' id='subject' onChange={handleChange} required>
            <option value=''>{t('Subject')}:</option>
            {subjects.map(subject => (
               <option key={subject.id} value={subject.title}>
                  {t(subject.title)}
               </option>
            ))}
         </select>

         {currSubjectFields && currSubjectFields[currFieldIdx] && (
            <div className='field-container'>
               <input
                  className={`field-input ${animationState}`}
                  type={currSubjectFields[currFieldIdx].type}
                  name={currSubjectFields[currFieldIdx].label}
                  placeholder={currSubjectFields[currFieldIdx].label}
                  value={msg[currSubjectFields[currFieldIdx].label] || ''}
                  onChange={handleChange}
               />
               <div className='btn-container'>
                  {currFieldIdx !== 0 && (
                     <button className='prev-btn' onClick={handlePrev}>
                        {t('Prev')}
                     </button>
                  )}
                  {currFieldIdx < currSubjectFields.length - 1 ? (
                     <button className='next-btn' onClick={handleNext}>
                        {t('Next')}
                     </button>
                  ) : (
                     <button type='submit' className='send-btn'>
                        {t('send')}
                     </button>
                  )}
               </div>
            </div>
         )}

         {/* <textarea
            name='content'
            id='content'
            cols='30'
            rows='10'
            placeholder='Type your message here'
            onChange={handleChange}></textarea> */}
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
