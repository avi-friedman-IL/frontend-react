import { trainingService } from '../../services/training'
import { store } from '../store'
import {
   ADD_TRAINING,
   REMOVE_TRAINING,
   SET_TRAINING,
   UPDATE_TRAINING,
   SET_FILTER,
   SET_LOADING,
} from '../reducers/training.reducer'

export async function loadTrainings(filterBy = {}) {
   store.dispatch({ type: SET_LOADING, isLoading: true })
   try {
      const trainings = await trainingService.query(filterBy)
      store.dispatch(getCmdSetTraining(trainings))
      return trainings
   } catch (err) {
      console.log('Cannot load trainings', err)
      throw err
   } finally {
      store.dispatch({ type: SET_LOADING, isLoading: false })
   }
}

export async function loadTraining(trainingId) {
   try {
      const training = await trainingService.getById(trainingId)
      return training
   } catch (err) {
      console.log('Cannot load training', err)
      throw err
   }
}

export async function removeTraining(trainingId) {
   try {
      await trainingService.remove(trainingId)
      store.dispatch(getCmdRemoveTraining(trainingId))
   } catch (err) {
      console.log('Cannot remove training', err)
      throw err
   }
}

export async function addTraining(training) {
   store.dispatch({ type: SET_LOADING, isLoading: true })
   try {
      const savedTraining = await trainingService.save(training)
      store.dispatch(getCmdAddTraining(savedTraining))
      return savedTraining
   } catch (err) {
      console.log('Cannot add training', err)
      throw err
   } finally {
      store.dispatch({ type: SET_LOADING, isLoading: false })
   }
}

export async function updateTraining(training) {
   try {
      const savedTraining = await trainingService.save(training)
      store.dispatch(getCmdUpdateTraining(savedTraining))
   } catch (err) {
      console.log('Cannot save training', err)
      throw err
   }
}

export async function setFilter(filterBy) {
   store.dispatch({ type: SET_FILTER, filterBy })
}

// Command Creators:
function getCmdSetTraining(trainings) {
   return {
      type: SET_TRAINING,
      trainings,
   }
}
function getCmdRemoveTraining(trainingId) {
   return {
      type: REMOVE_TRAINING,
      trainingId,
   }
}
function getCmdAddTraining(training) {
   return {
      type: ADD_TRAINING,
      training,
   }
}
function getCmdUpdateTraining(training) {
   return {
      type: UPDATE_TRAINING,
      training,
   }
}

// unitTestActions()
async function unitTestActions() {
   await loadTrainings()
   await addTraining(trainingService.getEmptyTraining())
   await updateTraining({
      _id: 'm1oC7',
      title: 'Training-Good',
   })
   await removeTraining('m1oC7')
   // TODO unit test addTrainingTraining
}
