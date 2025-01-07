import { useRef } from 'react'
import { useState } from 'react'
import Modal from 'react-modal'
import { IconsDetails } from './IconsDetails'

export function ChatIcons({ chat, users, user, onUpdate }) {
   const [isOpen, setIsOpen] = useState(false)
   const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
   const btnRef = useRef(null)

   function onOpenModal() {
      setIsOpen(true)
      setModalPosition({
         x: btnRef.current.getBoundingClientRect().left - 200,
         y: btnRef.current.getBoundingClientRect().top,
      })
   }

   return (
      <>
         <ul className='chat-icons'>
            {chat.emojis?.map((emoji, idx) => {
               return (
                  <li
                     className='icon'
                     key={idx}
                     ref={btnRef}
                     onClick={onOpenModal}>
                     {emoji.emoji}
                  </li>
               )
            })}
         </ul>
         <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            style={{
               overlay: {
                  backgroundColor: 'transparent',
               },
               content: {
                  top: modalPosition.y,
                  left: modalPosition.x,
                  right: 'auto',
                  bottom: 'auto',
                  width: 'max-content',
                  maxHeight: '300px',
                  overflow: 'auto',
                  backgroundColor: 'white',
                  borderRadius: '5px',
                  display: 'grid',
                  padding: '10px',
                  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
               },
            }}>
            <IconsDetails
               chat={chat}
               users={users}
               user={user}
               onUpdate={onUpdate}
               setIsOpen={setIsOpen}
            />
         </Modal>
      </>
   )
}
