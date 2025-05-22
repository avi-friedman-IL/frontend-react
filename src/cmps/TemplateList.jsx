import { TemplatePreview } from './TemplatePreview.jsx'

export function TemplateList({
   templates,
   setSelectedTemplateId,
   deleteTemplate,
   user,
}) {
   return (
      <ul className='template-list'>
         {templates.map(template => (
            <li key={template._id}>
               <TemplatePreview
                  template={template}
                  setSelectedTemplateId={setSelectedTemplateId}
                  deleteTemplate={deleteTemplate}
                  user={user}
               />
            </li>
         ))}
      </ul>
   )
}
