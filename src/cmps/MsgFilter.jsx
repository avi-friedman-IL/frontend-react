import { useSelector } from 'react-redux'
import { setFilter } from '../store/actions/msg.actions'
import { t } from 'i18next'
import { msgService } from '../services/msg'
import { useCallback } from 'react'
import { debounce } from 'lodash'

export function MsgFilter({ msgs }) {
   const filterBy = useSelector(state => state.msgModule.filterBy)
   
   // Create a debounced version of setFilter for text search
   const debouncedSetFilter = useCallback(
      debounce((filterBy) => {
         setFilter(filterBy)
      }, 500),
      []
   )

   function handleChange(ev) {
      const field = ev.target.name
      const value = ev.target.value
      
      if (field === 'text') {
         debouncedSetFilter({ ...filterBy, [field]: value })
      } else {
         setFilter({ ...filterBy, [field]: value })
      }
   }

   return (
      <form className='msg-filter grid-col align-center gap-1'>
         <div className='radio-inputs'>
            <input
               hidden
               type='radio'
               name='isDone'
               id='done'
               value='true'
               onChange={handleChange}
            />
            <label htmlFor='done'>{t('Done')}</label>
            <input
               hidden
               type='radio'
               name='isDone'
               id='undone'
               value='false'
               onChange={handleChange}
            />
            <label htmlFor='undone'>{t('Undone')}</label>
            <input
               hidden
               type='radio'
               name='isDone'
               id='all'
               value=''
               onChange={handleChange}
            />
            <label htmlFor='all'>{t('All')}</label>
         </div>

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
