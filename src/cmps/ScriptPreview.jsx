import { Link, Outlet } from 'react-router-dom'

export function ScriptPreview({ script }) {
   return (
      <section className='script-preview'>
         <header>
            <h1>{script.category}</h1>
         </header>
         <ul>
            {script.items?.map((item, idx) => (
               <li key={idx}>
                  <h5>{item.title}</h5>
               </li>
            ))}
         </ul>
         <Link to={`/script/edit/${script._id}`} className='btn' onClick={(ev) => ev.stopPropagation()}>
            Edit
         </Link>
      </section>
   )
}
