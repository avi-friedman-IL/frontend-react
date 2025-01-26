import { t } from 'i18next'
import { GrMoney } from 'react-icons/gr'
import { WiTime4 } from 'react-icons/wi'
import { IoDocumentAttachOutline } from 'react-icons/io5'
import { FaRegQuestionCircle } from 'react-icons/fa'

export function ObjectionPreview({ objection }) {
   const iconMap = {
      Money: <GrMoney />,
      Time: <WiTime4 />,
      Material: <IoDocumentAttachOutline />,
      Hesitating: <FaRegQuestionCircle />,
   }
   const Icon = iconMap[objection.Name]
   return (
      <section className='objection-preview'>
         <div className='icon'>
           {Icon}
         </div>
         <header>
            <h1>{objection.category}</h1>
         </header>
         <ul>
            {objection.items?.map((item, idx) => (
               <li key={item.id}>
                  <p>{item.title}</p>
               </li>
            ))}
         </ul>
      </section>
   )
}
