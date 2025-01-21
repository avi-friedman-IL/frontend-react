import Modal from 'react-modal'
import { useRef } from 'react'
import { useState } from 'react'
import { MdInsertEmoticon } from 'react-icons/md'
import i18n from '../i18n'
import { AiOutlineDelete } from 'react-icons/ai'
import { EmojiPicker } from './EmojiPicker'
export function ChatAction({ chat, user, onRemove, onUpdate }) {
   const [isOpen, setIsOpen] = useState(false)
   const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
   const btnRef = useRef(null)
   Modal.setAppElement('#root')

   function onOpenModal() {
      setIsOpen(true)
      setModalPosition({
         x:
            i18n.dir() === 'rtl'
               ? btnRef.current.getBoundingClientRect().left - 100
               : btnRef.current.getBoundingClientRect().left - 200,
         y: btnRef.current.getBoundingClientRect().top + 60,
      })
   }
   return (
      <section className='chat-action'>
         <div className='actions'>
            <button ref={btnRef} onClick={onOpenModal}>
               <MdInsertEmoticon />
            </button>

            {chat.fromUserId === user._id && (
               <button onClick={() => onRemove(chat._id)}>
                  <AiOutlineDelete />
               </button>
            )}
         </div>

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
                  padding: '0',
                  overflow: 'hidden',
                  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
               },
            }}>
            <EmojiPicker
               chat={chat}
               user={user}
               onUpdate={onUpdate}
               setIsOpen={setIsOpen}
            />
         </Modal>
      </section>
   )
}
