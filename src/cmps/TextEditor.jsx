import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useRef } from 'react'

export function TextEditor({ item, setEditedItem, setOpenItemId }) {
   const editorRef = useRef(null)
   useEffect(() => {
      if (editorRef.current) {
         editorRef.current.focus()
      }
   }, [])

   const defaultColor = item.style?.color || '#708090'

   return (
      <section className='text-editor'>
         <Editor
            apiKey='4t0jqmbiio9yuhkttljns4bgklv2e5783neoz12pg40tqje8'
            onInit={(evt, editor) => {
               editorRef.current = editor
               editor.on('ExecCommand', e => {
                  e.stopPropagation()
               })
            }}
            initialValue={item.content || ''}
            init={{
               language: 'he_IL',
               directionality: 'rtl',
               menubar: false,
               // skin: false,
               // content_css: false,
               plugins: [
                  'advlist',
                  'autolink',
                  'lists',
                  'link',
                  'image',
                  'charmap',
                  'preview',
                  'anchor',
                  'searchreplace',
                  'visualblocks',
                  'code',
                  'fullscreen',
                  'insertdatetime',
                  'media',
                  'table',
                  'help',
                  'wordcount',
               ],

               toolbar:
                  'formatselect | bold italic forecolor backcolor | \
               alignleft aligncenter alignright alignjustify | \
               bullist numlist outdent indent | removeformat | help',
               content_style: `
               body {
                  font-family: 'Roboto', sans-serif;
                     `,

               color_map: [
                  defaultColor,
                  'Default color',
                  'black',
                  'Black',
                  'red',
                  'Red',
                  'blue',
                  'Blue',
                  'green',
                  'Green',
               ],
            }}
            onEditorChange={content => (editorRef.current = content)}
            onBlur={() =>
               setEditedItem(prevState => ({
                  ...prevState,
                  content: editorRef.current,
               }))
            }
         />
      </section>
   )
}

