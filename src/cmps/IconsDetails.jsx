import * as ReactIcons from 'react-icons/fa'

export function IconsDetails({ chat, users, user, onUpdate, setIsOpen }) {
   function handleClick(idx) {
      const emojis = chat.emojis.filter((emoji, i) => i !== idx)
      onUpdate({ ...chat, emojis })
      setIsOpen(false)
   }
   return (
      <ul className='icons-details'>
         {chat.emojis?.map((emoji, idx) => {
            return (
               <li key={idx} onClick={() => handleClick(idx)}>
                  <img
                     className='img-url'
                     src={
                        users.find(user => user._id === emoji.fromUserId)
                           ?.imgUrl
                     }
                     alt=''
                  />
                  <span>
                     <p>
                        {
                           users.find(user => user._id === emoji.fromUserId)
                              ?.fullname
                        }
                     </p>
                     <p>
                        {user._id === emoji.fromUserId && 'Select to remove'}
                     </p>
                  </span>
                  <span>{emoji.emoji}</span>
               </li>
            )
         })}
      </ul>
   )
}
