import { t } from "i18next";

export function TemplatePreview({
   template,
   setSelectedTemplateId,
   deleteTemplate,
   user,
}) {
   return (
      <section
         className='template-preview'
         onClick={() => setSelectedTemplateId(template._id)}>
         <h1>{template.title}</h1>
         {user?.isAdmin && <button className="delete-btn btn1" onClick={(ev) => deleteTemplate(ev, template._id)}>{t('Delete')}</button>}
      </section>
   )
}
