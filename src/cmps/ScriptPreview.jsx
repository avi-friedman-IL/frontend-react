import { t } from 'i18next'
import { IoDocumentTextOutline } from 'react-icons/io5'
export function ScriptPreview({ script }) {
   return (
      <section className='script-preview'>
         <div className="script-preview-container">

         <IoDocumentTextOutline />{' '}
         <header>
            <h1>{script.title}</h1>
         </header>
         <p>{t('call script')}</p>
         </div>
      </section>
   )
}
