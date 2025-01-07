import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

export function EmojiPicker({ chat, user, onUpdate, setIsOpen }) {
    async function handleSelectEmoji(emoji) {
        onUpdate({
            ...chat,
            emojis: chat.emojis
                ? [...chat.emojis, { emoji: emoji.native, fromUserId: user._id }]
                : [{ emoji: emoji.native, fromUserId: user._id }],
        })
        setIsOpen(false)
    }
   return (
      <Picker
         data={data}
         onEmojiSelect={handleSelectEmoji}
         theme='light' 
         emojiButtonSize={32} 
         emojiSize={24}
      />
   )
}
