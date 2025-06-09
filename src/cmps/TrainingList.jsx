import { Link, useNavigate } from 'react-router-dom'
import { TrainingPreview } from './TrainingPreview.jsx'
import { t } from 'i18next'

export function TrainingList({ trainings, onRemove, isAuthorized }) {
   const navigate = useNavigate()
   return (
      <section className="training-list">
         <ul>
            {trainings.map(training => (
               <li key={training._id} className='' onClick={() => navigate(`/training/details/${training._id}`)}>
                  <TrainingPreview training={training} />
                  <div className='training-list-actions'>
                     {isAuthorized && <button className='delete-btn' onClick={e => onRemove(e, training._id)}>{t('remove')}</button>}
                     {isAuthorized && <Link onClick={e => e.stopPropagation()} to={`/training/edit/${training._id}`} className='edit-btn'>{t('edit')}</Link>}
                  </div>
               </li>
            ))}
         </ul>
      </section>
   )
}