export function TemplatePreview({
   template,
   setIsShowTemplate,
   setSelectedTemplateId,
}) {
   return (
      <section
         className='template-preview card'
         onClick={() => setSelectedTemplateId(template._id)}>
         <h1>{template.title}</h1>
      </section>
   )
}
