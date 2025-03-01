import { setFilter } from '../store/actions/msg.actions'
import { useSelector } from 'react-redux'
import { t } from 'i18next'
import { msgService } from '../services/msg'

export function MsgSidebar() {
   const filterBy = useSelector(state => state.msgModule.filterBy)
   const subjects = msgService.getSubjects()
   function handleClick(ev, subject) {
      ev.preventDefault()
      setFilter({ ...filterBy, subject })
   }
   return (
      <ul className='msg-sidebar'>
         <li
            key='all'
            onClick={ev => handleClick(ev, '')}
            className={`subject-filter ${!filterBy.subject ? 'active' : ''}`}>
            <button>{t('all')}</button>
         </li>
         {subjects.map((subject, idx) => (
            <li
               key={subject.id}
               onClick={ev => handleClick(ev, subject.title)}
               className={`subject-filter ${
                  subject.title === filterBy.subject ? 'active' : ''
               }`}>
               <button>{t(subject.title)}</button>
            </li>
         ))}
      </ul>
   )
}
