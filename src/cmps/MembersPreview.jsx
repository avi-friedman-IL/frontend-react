import { IoPersonAdd, IoPersonRemoveSharp } from 'react-icons/io5'
import { useSelector } from 'react-redux'

export function MembersPreview({ member, onAdd, onRemove }) {
   const user = useSelector(state => state.userModule.user)
   const isContact = user.contacts?.find(contact => contact._id === member._id)
   return (
      <>
         <img className='img-url' src={member.imgUrl} alt='😉' />
         <p>{member.fullname}</p>
         {isContact && <button onClick={() => onRemove(member._id)}><IoPersonRemoveSharp /></button>}
         {!isContact && <button onClick={() => onAdd(member._id)}><IoPersonAdd /></button>}
      </>
   )
}
