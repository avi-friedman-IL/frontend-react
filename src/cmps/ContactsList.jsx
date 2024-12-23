import { ContactsPreview } from './ContactsPreview'

export function ContactsList({ contacts, toUserId, setToUserId,  userId }) {
   return (
      <ul className='contacts-list'>
         {contacts.map(contact => (
            <li
               className={`contacts-preview ${
                  toUserId === contact._id ? 'active' : ''
               }`}
               key={contact._id}
               onClick={() => setToUserId(contact._id)}>
               <ContactsPreview contact={contact}  userId={userId}/>
            </li>
         ))}
      </ul>
   )
}
