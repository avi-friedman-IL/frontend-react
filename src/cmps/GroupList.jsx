import { RiCloseLine } from 'react-icons/ri'
import { GroupPreview } from './GroupPreview.jsx'

export function GroupList({ groups, toGroupId, userId, onGroupPicker, onRemoveGroup }) {
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
                     <button
                        className=''
                        onClick={ev => {
                           ev.stopPropagation()
                           onRemoveGroup(group.id)
                        }}>
                        <RiCloseLine />
                     </button>
                  </li>
               ))}
         </ul>
      </>
   )
}
