import * as ReactIcons from 'react-icons/fc'

export function IconsDetails({ chat, users, user, onUpdate, setIsOpen }) {
   function handleClick(idx) {
      onUpdate({
         ...chat,
         icons: chat.icons.filter(icon => icon.fromUserId !== user._id),
      })
      setIsOpen(false)
   }
   return (
      <ul className='icons-details'>
         {chat.icons?.map((icon, idx) => {
            const Icon = ReactIcons[icon.Icon]
            // if(!Icon) return <></>
            return (
               <li key={idx} onClick={() => handleClick(idx)}>
                  <img
                     className='img-url'
                     src={users.find(user => user._id === icon.fromUserId)?.imgUrl}
                     alt=''
                  />
                  <span>
                     <p>{users.find(user => user._id === icon.fromUserId)?.fullname}</p>
                     <p>{user._id === icon.fromUserId && 'Select to remove'}</p>
                  </span>
                  <span><Icon /></span>
               </li>
            )
         })}
      </ul>
   )
}
