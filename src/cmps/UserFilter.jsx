import { t } from 'i18next'
import { useSelector } from 'react-redux'
import { setFilter } from '../store/actions/user.actions'
import { useCallback } from 'react'
import { debounce } from 'lodash'
export function UserFilter({ setIsOpenAddUser }) {
   const filterBy = useSelector(store => store.userModule.filterBy)

   const debouncedSetFilter = useCallback(
      debounce(filterBy => {
         setFilter(filterBy)
      }, 500),
      []
   )
   function handleChange(ev) {
      const { name, value } = ev.target
      if (name === 'text') {
         debouncedSetFilter({ ...filterBy, [name]: value })
      } else {
         setFilter({ ...filterBy, [name]: value })
      }
   }
   return (
      <div className='user-filter grid-col align-center gap-1'>
         <button className='add-btn' onClick={() => setIsOpenAddUser(true)}>
            {t('Add user')}
         </button>
         <input
            className='search-input pad-1'
            onChange={handleChange}
            name='text'
            type='text'
            placeholder={t('Search by name')}
            // value={filterBy.text || ''}
         />
      </div>
   )
}
