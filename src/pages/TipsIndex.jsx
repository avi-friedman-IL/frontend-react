import { useParams } from 'react-router'
import { TipsList } from '../cmps/TipsList.jsx'
import { getScriptById } from '../store/actions/script.actions.js'
import { useEffect, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { t } from 'i18next'
import { TipsEdit } from '../cmps/TipsEdit.jsx'
import '@fontsource/rubik-doodle-shadow' // טוען את הפונט
import { useSelector } from 'react-redux'

export function TipsIndex() {
   const params = useParams()
   const [tips, setTips] = useState(null)
   const [isEdit, setIsEdit] = useState(false)
   const user = useSelector(state => state.userModule.user)

   useEffect(() => {
      loadTips()
   }, [params.id, isEdit])

   async function loadTips() {
      try {
         const script = await getScriptById(params.id)
         setTips(script.tips)
      } catch (err) {
         console.log('Cannot load tips', err)
      }
   }

   return (
      <section className='tips-index'>
         {user?.isAdmin && (
            <button
               className='edit-btn btn3'
               onClick={() => setIsEdit(!isEdit)}>
               <span>{t('Edit Tips')}</span>
               <AiOutlineEdit />
            </button>
         )}
         {tips?.length > 0 && <TipsList tips={tips} />}
         {isEdit && <TipsEdit setIsEdit={setIsEdit} tips={tips} />}
      </section>
   )
}
