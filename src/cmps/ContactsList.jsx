import { t } from 'i18next'
import { ContactsPreview } from './ContactsPreview'

export function ContactsList({
   contacts,
   toUserId,
   setToGroupId,
   setToUserId,
   userId,
}) {

   function onContactPicker(contactId) {
      setToGroupId(null)
      setToUserId(contactId)
   }
   return (
      <ul className='contacts-list'>
         {contacts.map(contact => (
            <li
               className={`contacts-preview ${
                  toUserId === contact._id ? 'active' : ''
               }`}
               key={contact._id}
               onClick={() => onContactPicker(contact._id)}>
               <ContactsPreview contact={contact} userId={userId} />
            </li>
         ))}
      </ul>
   )
}
