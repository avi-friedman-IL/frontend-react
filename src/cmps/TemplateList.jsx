import { TemplatePreview } from './TemplatePreview.jsx'

export function TemplateList({
   templates,
   setIsShowTemplate,
   setSelectedTemplateId,
}) {
   return (
      <ul className='template-list grid-col gap-1'>
         {templates.map(template => (
            <li key={template._id}>
               <TemplatePreview
                  template={template}
                  setIsShowTemplate={setIsShowTemplate}
                  setSelectedTemplateId={setSelectedTemplateId}
               />
            </li>
         ))}
      </ul>
   )
}
