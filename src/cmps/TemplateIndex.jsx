import { useSelector } from 'react-redux'
import { loadTemplates } from '../store/actions/template.actions.js'
import { TemplateList } from './TemplateList.jsx'
import { IoMdClose } from 'react-icons/io'
import { useEffect, useState } from 'react'
import { TemplateMsg } from './TemplateMsg.jsx'
import { t } from 'i18next'
export function TemplateIndex({ setIsShowTemplate }) {
   const templates = useSelector(state => state.templateModule.templates)
   const [template, setTemplate] = useState(null)
   const [selectedTemplateId, setSelectedTemplateId] = useState(null)

   useEffect(() => {
      loadCmp()
   }, [templates?.length])

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
   if (!templates?.length) return <div className='loading'>Loading...</div>
   return (
      <section className='template-index form2'>
         {!template && (
            <TemplateList
               templates={templates}
               setIsShowTemplate={setIsShowTemplate}
               setSelectedTemplateId={setSelectedTemplateId}
            />
         )}
         {template && (
            <button
               className='btn1'
               onClick={() => {
                  setIsShowTemplate(true)
                  setSelectedTemplateId(null)
                  setTemplate(null)
               }}>
               {t('back')}
            </button>
         )}
         {template && <TemplateMsg template={template} setTemplate={setTemplate} setIsShowTemplate={setIsShowTemplate} />}
         <button className='close-btn' onClick={() => setIsShowTemplate(false)}>
            <IoMdClose />
         </button>
      </section>
   )
}
