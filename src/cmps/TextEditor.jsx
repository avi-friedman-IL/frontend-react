import { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export function TextEditor({ item, setEditedItem }) {
   const [editorHtml, setEditorHtml] = useState(item.content)

   function handleEditorChange(html) {
      setEditorHtml(html)
      setEditedItem(prevState => ({
         ...prevState,
         content: html,
      }))
   }

   return (
      <div className='text-editor'>
         <ReactQuill
            className='text-editor'
            value={editorHtml}
            onChange={handleEditorChange}
            modules={{
               toolbar: [
                  // [{ header: '1' }, { header: '2' }, { font: [] }],
                  // [{ list: 'ordered' }, { list: 'bullet' }],
                  ['bold', 'italic', 'underline'],
                  ['link'],
                  [{ align: [] }],
                  ['image'],
                  [{ color: [item.style?.color] }, { background: [] }], // dropdown with defaults from theme
               ],
            }}
            theme='snow' // ניתן גם לבחור 'bubble' עבור נושא אחר
         />
      </div>
   )
}
