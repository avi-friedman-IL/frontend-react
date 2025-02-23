import { GrDocumentText, GrMoney } from 'react-icons/gr'
import { FaRegQuestionCircle } from 'react-icons/fa'
import { ImClock } from 'react-icons/im'
import { useNavigate } from 'react-router'

export function ObjectionPreview({ objection }) {
   const navigate = useNavigate()

   const iconMap = {
      Money: <GrMoney />,
      Time: <ImClock />,
      Material: <GrDocumentText />,
      Hesitating: <FaRegQuestionCircle />,
   }
   const Icon = iconMap[objection.Name]
   return (
      <section className='objection-preview'>
         <header
            className='btn1'
            onClick={() => navigate(`/objection/details/${objection._id}`)}>
            <h1>{objection.category}</h1>
            <div className='icon'>{Icon}</div>
         </header>
         <div className='objection-items-container'>
            <ul className='objection-items'>
               {objection.items?.map((item, idx) => (
                  <li
                     key={item.id}
                     className='item'
                     onClick={() =>
                        navigate(
                           `/objection/details/${objection._id}/${item.id}`
                        )
                     }>
                     <p>{item.title}</p>
                  </li>
               ))}
            </ul>
         </div>
      </section>
   )
}
