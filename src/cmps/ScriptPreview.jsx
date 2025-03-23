import { t } from 'i18next'
import { IoDocumentTextOutline } from 'react-icons/io5'
export function ScriptPreview({ script, onRemove, user }) {
   return (
      <section className='script-preview'>
         <div className="script-preview-container">

         <IoDocumentTextOutline />{' '}
         <header>
            <h1>{script.title}</h1>
         </header>
         <p>{t('call script')}</p>
         {user?.isAdmin && <button
                  className='remove-btn btn1'
                  onClick={(ev) => onRemove(ev, script._id)}>
                     {t('Remove')}
               </button>}
         </div>
      </section>
   )
}
