import { t } from 'i18next'
import { GroupPreview } from './GroupPreview.jsx'

export function GroupList({
   groups,
   toGroupId,
   setToGroupId,
   setToUserId,
   userId,
}) {
   function onGroupPicker(groupId) {
      setToUserId(null)
      setToGroupId(groupId)
   }
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
                  </li>
               ))}
         </ul>
      </>
   )
}
