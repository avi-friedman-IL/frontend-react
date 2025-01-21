import { useNavigate } from 'react-router-dom'
import { ScriptPreview } from './ScriptPreview.jsx'

export function ScriptList({ scripts }) {
   const navigate = useNavigate()
   return (
      <ul className='script-list'>
         {scripts.map(script => (
            <li
               key={script._id}
               onClick={() => navigate(`details/${script._id}`)}>
               <ScriptPreview script={script} />
            </li>
         ))}
      </ul>
   )
}
