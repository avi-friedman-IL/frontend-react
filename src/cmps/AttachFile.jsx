import { BsPaperclip } from 'react-icons/bs'

export function AttachFile({ handleFileChange, fileInputRef }) {
   return (
      <>
         <input
            type='file'
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
         />
         <button
            onClick={() => fileInputRef.current.click()}
            className='file-input'
            title='צרף קובץ'>
            <BsPaperclip />
         </button>
      </>
   )
}
