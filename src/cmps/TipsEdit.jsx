import { t } from 'i18next'
import { useState } from 'react'
import { getScriptById, updateScript } from '../store/actions/script.actions'
import { useParams } from 'react-router'
import { makeId } from '../services/util.service'
import { AiFillDelete } from 'react-icons/ai'

export function TipsEdit({ setIsEdit, tips }) {
   const params = useParams()
   const [tipsToEdit, setTipsToEdit] = useState(tips?.length?[...tips]:[{ id: makeId(), text: '' }])

   function onAddTip(ev) {
      ev.preventDefault()
      const newTip = { id: makeId(), text: '' }
      setTipsToEdit([...tipsToEdit, newTip])
   }

   async function handleChange(ev, tipId) {
      const { value } = ev.target
      const updatedTips = tipsToEdit.map(tip => {
         if (tip.id === tipId) tip.text = value
         return tip
      })
      setTipsToEdit(updatedTips)
   }

   async function onSave(ev) {
      ev.preventDefault()
      try {
         const script = await getScriptById(params.id)
         const updatedScript = { ...script, tips: tipsToEdit }
         await updateScript(updatedScript)
         setIsEdit(false)
      } catch (err) {
         console.log('Cannot save tips', err)
      }
   }

   async function onDelete(tipId) {
      const updatedTips = tipsToEdit.filter(tip => tip.id !== tipId)
      setTipsToEdit(updatedTips)
   }

   function onClose(ev) {
      ev.preventDefault()
      setIsEdit(false)
   }

   return (
      <form className='form1 tips-edit'>
         <button className='btn3' onClick={onAddTip}>
            <span>{t('Add Tip')}</span>
         </button>
         {tipsToEdit.map(tip => (
            <div key={tip.id} className='form-group'>
               <article className='tip-edit'>
                  <button
                     className='delete-tip btn3'
                     onClick={() => onDelete(tip.id)}>
                     <span>{t('Delete')}</span>
                     <AiFillDelete />
                  </button>
                  <textarea
                     id='tip'
                     name='text'
                     value={tip.text}
                     placeholder={t('Enter tip')}
                     onChange={ev => handleChange(ev, tip.id)}
                  />
               </article>
            </div>
         ))}
         <div className='form-btns'>
            <button className='btn1' onClick={onSave}>
               {t('Save')}
            </button>
            <button className='btn1' onClick={onClose}>
               {t('Close')}
            </button>
         </div>
      </form>
   )
}
