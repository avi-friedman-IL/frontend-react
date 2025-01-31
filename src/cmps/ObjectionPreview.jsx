import { t } from 'i18next'
import { GrMoney } from 'react-icons/gr'
import { WiTime4 } from 'react-icons/wi'
import { IoDocumentAttachOutline } from 'react-icons/io5'
import { FaRegQuestionCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router'

export function ObjectionPreview({ objection }) {
   const navigate = useNavigate()

   const iconMap = {
      Money: <GrMoney />,
      Time: <WiTime4 />,
      Material: <IoDocumentAttachOutline />,
      Hesitating: <FaRegQuestionCircle />,
   }
   const Icon = iconMap[objection.Name]
   return (
      <section className='objection-preview'>
         <header
            className='btn2'
            onClick={() => navigate(`/objection/details/${objection._id}`)}>
            <div className='icon'>{Icon}</div>
            <h1>{objection.category}</h1>
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
