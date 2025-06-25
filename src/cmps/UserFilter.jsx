import { t } from 'i18next'
import { useSelector } from 'react-redux'
import { setUserFilter } from '../store/actions/user.actions'
import { useCallback } from 'react'
import { debounce } from 'lodash'
import { useParams } from 'react-router-dom'

export function UserFilter({ setIsOpenAddUser, cmp }) {
   const params = useParams()
   const filterBy = useSelector(store => store.userModule.filterBy)

   const debouncedSetFilter = useCallback(
      debounce(filterBy => {
         setUserFilter(filterBy)
      }, 500),
      []
   )
   
   function handleChange(ev) {
      const { name, value } = ev.target
      if (name === 'text') {
         debouncedSetFilter({ ...filterBy, [name]: value })
      } else {
         setUserFilter({ ...filterBy, [name]: value })
      }
   }
   
   return (
      <div
         className={`user-filter ${cmp === 'contacts' ? 'contacts' : 'pad-1'}`}>
         {cmp === 'users' && (
            <button className='add-btn' onClick={() => setIsOpenAddUser(true)}>
               {t('Add user')}
            </button>
         )}

         <input
            className='input pad-1'
            onChange={handleChange}
            name='text'
            type='text'
            placeholder={t('Search by name')}
            autoFocus
            // value={filterBy.text || ''}
         />
         
         {/* סינון לפי מגדר */}
         {cmp === 'users' && (
            <select
               className='gender-filter-select'
               name='gender'
               onChange={handleChange}
               value={filterBy.gender || ''}
            >
               <option value="">{t('All genders')}</option>
               <option value="male">{t('Male')}</option>
               <option value="female">{t('Female')}</option>
            </select>
         )}
      </div>
   )
}
