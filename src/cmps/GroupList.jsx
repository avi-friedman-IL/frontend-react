import { FaTrash } from 'react-icons/fa'
import { GroupPreview } from './GroupPreview.jsx'
import { t } from 'i18next'

export function GroupList({
   groups,
   toGroupId,
   userId,
   onGroupPicker,
   onRemoveGroup,
   user,
}) {
   return (
      <>
         <ul className='contacts-list'>
            {groups &&
               groups.map((group, idx) => (
                  <li
                     className={`contacts-preview ${
                        toGroupId === group.id ? 'active' : ''
                     }`}
                     key={idx}
                     onClick={() => onGroupPicker(group.id)}>
                     <GroupPreview group={group} userId={userId} />
                     {user.groups?.length > 0 && (
                        <button
                           className='delete-btn'
                           onClick={ev => {
                              ev.stopPropagation()
                              onRemoveGroup(group.id)
                           }}>
                           {t('Delete')}
                        </button>
                     )}
                  </li>
               ))}
         </ul>
      </>
   )
}
