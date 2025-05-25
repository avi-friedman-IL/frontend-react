import { setFilter } from '../store/actions/msg.actions'
import { useSelector } from 'react-redux'
import { t } from 'i18next'
import { msgService } from '../services/msg'
import { loadTemplates } from '../store/actions/template.actions'
import { useEffect } from 'react'

export function MsgSidebar() {
   const filterBy = useSelector(state => state.msgModule.filterBy)
   const templates = useSelector(state => state.templateModule.templates)
   function handleClick(ev, subject) {
      ev.preventDefault()
      setFilter({ ...filterBy, subject })
   }

   useEffect(() => {
      loadTemplates()
   }, [])
   return (
      <ul className='msg-sidebar'>
         <li
            key='all'
            onClick={ev => handleClick(ev, '')}
            className={`subject-filter ${!filterBy.subject ? 'active' : ''}`}>
            <button>{t('all')}</button>
         </li>
         {templates?.map((template) => (
            <li
               key={template._id}
               onClick={ev => handleClick(ev, template.title)}
               className={`subject-filter ${
                  template.title === filterBy.subject ? 'active' : ''
               }`}>
               <button>{t(template.title)}</button>
            </li>
         ))}
      </ul>
   )
}
