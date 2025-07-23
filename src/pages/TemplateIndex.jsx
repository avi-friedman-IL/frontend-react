import { useSelector } from 'react-redux'
import {
   loadTemplates,
   removeTemplate,
} from '../store/actions/template.actions.js'

import { useEffect, useState } from 'react'
import { t } from 'i18next'
import { Link } from 'react-router-dom'
import { TemplateList } from '../cmps/TemplateList.jsx'
import { TemplateMsg } from '../cmps/TemplateMsg.jsx'
import { addMsg } from '../store/actions/msg.actions.js'
export function TemplateIndex() {
   const user = useSelector(state => state.userModule.user)
   const templates = useSelector(state => state.templateModule.templates)
   const [template, setTemplate] = useState(null)
   const [selectedTemplateId, setSelectedTemplateId] = useState(null)

   useEffect(() => {
      loadCmp()
   }, [])

   useEffect(() => {
      if (selectedTemplateId) {
         setTemplate(
            templates.find(template => template._id === selectedTemplateId)
         )
      }
   }, [selectedTemplateId])

   async function loadCmp() {
      try {
         await loadTemplates()
      } catch (err) {
         console.log('err', err)
      }
   }

   async function deleteTemplate(ev, templateId) {
      ev.stopPropagation()
      const isConfirmed = window.confirm(t('Are you sure you want to delete this template?'))
      if (!isConfirmed) return
      try {
         await removeTemplate(templateId)
      } catch (err) {
         console.log('err', err)
      }
   }

   async function onAddMsg(newMsg) {
      try {
         await addMsg(newMsg)
      } catch (err) {
         console.log('Cannot add msg', err)
      }
   }

   if (!templates?.length) return <div className='loading'>Loading...</div>
   return (
      <section className='template-index'>
         {user?.isAdmin && <Link to='/template/edit' className='btn1'>
            {t('Add message template')}
         </Link>}
         {!template && <h1>{t('Select subject')}:</h1>}
         {!template && (
            <TemplateList
               user={user}
               templates={templates}
               setSelectedTemplateId={setSelectedTemplateId}
               deleteTemplate={deleteTemplate}
            />
         )}
         {template && (
            <button
               className='btn1'
               onClick={() => {
                  setSelectedTemplateId(null)
                  setTemplate(null)
               }}>
               {t('back')}
            </button>
         )}
         {template && (
            <TemplateMsg template={template} setTemplate={setTemplate} onAddMsg={onAddMsg} />
         )}
      </section>
   )
}
