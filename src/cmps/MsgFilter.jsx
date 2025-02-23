import { useSelector } from 'react-redux'
import { setFilter } from '../store/actions/msg.actions'
import { t } from 'i18next'
import { msgService } from '../services/msg'

export function MsgFilter({ msgs }) {
   const filterBy = useSelector(state => state.msgModule.filterBy)
   function handleChange(ev) {
      const field = ev.target.name
      const value = ev.target.value
      setFilter({ ...filterBy, [field]: value })
   }

   function handleClick(ev, subject) {
      ev.preventDefault()
      setFilter({ ...filterBy, subject })
   }

   //    const subjects = msgs.reduce((acc, msg) => {
   //       if (!acc.includes(msg.subject) && msg.subject) acc.push(msg.subject)
   //       return acc
   //    }, [])
   const subjects = msgService.getSubjects()
   return (
      <form className='msg-filter grid-col align-center'>
         <ul className='grid-col'>
            <li
               key='all'
               onClick={ev => handleClick(ev, '')}
               className={`subject-filter ${
                  !filterBy.subject ? 'active' : ''
               }`}>
               <button>{t('all')}</button>
            </li>
            {subjects.map((subject, idx) => (
               <li
                  key={idx}
                  onClick={ev => handleClick(ev, subject)}
                  className={`subject-filter ${
                     subject === filterBy.subject ? 'active' : ''
                  }`}>
                  <button>{t(subject)}</button>
               </li>
            ))}
         </ul>

         <input
            className='search-input pad-1'
            onChange={handleChange}
            name='text'
            type='text'
            placeholder={t('Search')}
         />
      </form>
   )
}
