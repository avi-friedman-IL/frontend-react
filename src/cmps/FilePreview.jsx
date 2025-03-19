export function FilePreview({ selectedFile, filePreview, removeFile }) {
   if (!selectedFile) return null;
   
   const isPDF = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
   const isImage = selectedFile.type.startsWith('image/');
   
   return (
      <div className='file-preview-container'>
         {isImage ? (
            <div className='image-preview'>
               <img
                  src={filePreview}
                  alt='Preview'
                  className='file-preview-image'
               />
               <button onClick={removeFile} className='remove-file-btn'>
                  ×
               </button>
            </div>
         ) : isPDF ? (
            <div className='pdf-preview'>
               <span className='file-name'>{selectedFile.name}</span>
               <span className='file-type'>PDF</span>
               <button onClick={removeFile} className='remove-file-btn'>
                  ×
               </button>
            </div>
         ) : (
            <div className='file-info'>
               <span className='file-name'>{selectedFile.name}</span>
               <span className='file-type'>{selectedFile.type.split('/').pop() || 'File'}</span>
               <button onClick={removeFile} className='remove-file-btn'>
                  ×
               </button>
            </div>
         )}
      </div>
   )
}
