import { CKEditor } from '@ckeditor/ckeditor5-react'
import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from 'ckeditor5'

import 'ckeditor5/ckeditor5.css'

export function TextEditor({ value }) {
   return (
      <CKEditor
         editor={ClassicEditor}
         config={{
            licenseKey: 'GPL', // Or 'GPL'.
            plugins: [Essentials, Paragraph, Bold, Italic],
            toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
         }}
         data={value}
            onChange={(event, editor) => {
                const data = editor.getData()
                console.log({ event, editor, data })
            }}
      />
   )
}
