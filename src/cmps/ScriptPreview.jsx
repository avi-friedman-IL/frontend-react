import { t } from 'i18next'
import { IoDocumentTextOutline } from 'react-icons/io5'
export function ScriptPreview({ script }) {
   return (
      <section className='script-preview'>
         <IoDocumentTextOutline />{' '}
         <header>
            <h1>{script.title}</h1>
         </header>
         <p>{t('call script')}</p>
      </section>
   )
}
