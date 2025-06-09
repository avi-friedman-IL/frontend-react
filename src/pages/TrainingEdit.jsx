import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { addTraining, loadTraining, updateTraining } from '../store/actions/training.actions'
import { t } from 'i18next'
import { makeId } from '../services/util.service'

export function TrainingEdit() {
   const params = useParams()
   const navigate = useNavigate()
   const [training, setTraining] = useState(null)

   useEffect(() => {
      load()
   }, [params.id])

   async function load() {
      if (params.id) {
         const training = await loadTraining(params.id)
         setTraining(training)
      } else {
         setTraining({
            title: '',
            items: [getEmptyItem()]
         })
      }
   }

   function getEmptyItem() {
      return {
         id: makeId(),
         text: ''
      }
   }

 async  function onSave(ev) {
      ev.preventDefault()
      try {
         if (params.id) {
            await updateTraining(training)
         } else {
            await addTraining(training)
         }
         navigate('/training')
      } catch (err) {
         console.log('Cannot save training', err)
      }
   }

   function handleChangeItem(ev) {
      const { id, value } = ev.target
      setTraining(prevTraining => ({ ...prevTraining, items: prevTraining.items.map(item => item.id === id ? { ...item, text: value } : item) }))
   }

   function handleChange(ev) {
      const { name, value } = ev.target
      setTraining(prevTraining => ({ ...prevTraining, [name]: value }))
   }

   function handleRemoveItem(itemId) {
      setTraining(prevTraining => ({ ...prevTraining, items: prevTraining.items.filter(item => item.id !== itemId) }))
   }

   function handleAddItem() {
      setTraining(prevTraining => ({ ...prevTraining, items: [...prevTraining.items, getEmptyItem()] }))
   }

   if (!training) return <div>Loading...</div>

   return (
      <form className="training-edit" onSubmit={onSave}>
         <div className="training-edit-header">
            <input className='input' type="text" name='title' value={training.title} onChange={handleChange} placeholder={t('title')} />
         </div>
         <div className="training-edit-items">
         {training.items?.map(item => (
            <div key={item.id} className='training-edit-item'>
               <textarea className='textarea' type="text" id={item.id} name='text' value={item.text} onChange={handleChangeItem} placeholder={t('item')} />
               <button className='add-btn' type="button" onClick={() => handleRemoveItem(item.id)}>{t('remove item')}</button>
            </div>
         ))}
         </div>
         <div className="training-edit-footer">
            <button className='add-btn' type="button" onClick={() => handleAddItem()}>{t('add item')}</button>
            <button className='add-btn' type="submit">{t('save')}</button>
         </div>
      </form>
   )
}