import * as ReactIcons from 'react-icons/fc'
export function IconPicker({ chat, user, onUpdate, setIsOpen }) {
   const icons = { ...ReactIcons }

   async function handleClick(iconName) {
      onUpdate({
         ...chat,
         icons: chat.icons
            ? [...chat.icons, { Icon:iconName, fromUserId: user._id }]
            : [{ Icon:iconName, fromUserId: user._id }],
      })
      setIsOpen(false)
   }
   return (
      <ul className='icon-picker'>
         {Object.keys(icons).map((icon, idx) => {
            const Icon = icons[icon]
            return (
               <li key={idx} onClick={() => handleClick(icon)}>
                  <Icon />
               </li>
            )
         })}
      </ul>
   )
}
