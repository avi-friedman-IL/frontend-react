export function ScriptPreview({ script }) {
   return (
      <section className='script-preview'>
         <header>
            <h1 style={{ color: script.style?.color }}>{script.category}</h1>
         </header>
         <ul>
            {script.items?.map((item, idx) => (
               <li key={item.id}>
                  <h4>{item.title}</h4>
               </li>
            ))}
         </ul>
      </section>
   )
}
