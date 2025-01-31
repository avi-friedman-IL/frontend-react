import { useNavigate } from 'react-router-dom'
import { ObjectionPreview } from './ObjectionPreview.jsx'

export function ObjectionList({ objections }) {
   const navigate = useNavigate()
   return (
      <ul className='objection-list'>
         {objections.map(objection => (
            <li
               key={objection._id}
               >
               <ObjectionPreview objection={objection} />
            </li>
         ))}
      </ul>
   )
}
