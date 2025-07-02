import { useSelector } from 'react-redux'
import { TrainingList } from '../cmps/TrainingList.jsx'
import { loadTrainings, removeTraining } from '../store/actions/training.actions.js'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { t } from 'i18next'

export function TrainingIndex() {
   const trainings = useSelector(state => state.trainingModule.trainings)
   const user = useSelector(state => state.userModule.user)
   const filterBy = useSelector(state => state.trainingModule.filterBy)
   useEffect(() => {
      const initialFilter = { ...filterBy, gender: user?.gender }
      loadTrainings(initialFilter)
   }, [])

  async function onRemove(e, trainingId) {
      e.stopPropagation()
      try {
         await removeTraining(trainingId)
      } catch (err) {
         console.log('Cannot remove training', err)
      }
   }
   const isAuthorized = user?.isAdmin || user?.isTeamManager
   if (!trainings) return <div>Loading...</div>
   return (
      <section className='training-index'>
         {isAuthorized && <Link to='/training/edit' className='add-training add-btn'>{t('Add Training')}</Link>}
         <TrainingList trainings={trainings} onRemove={onRemove} isAuthorized={isAuthorized} />
      </section>
   )
}
