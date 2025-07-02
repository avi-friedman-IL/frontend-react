
export const SET_TRAINING = 'SET_TRAINING'
export const REMOVE_TRAINING = 'REMOVE_TRAINING'
export const ADD_TRAINING = 'ADD_TRAINING'
export const UPDATE_TRAINING = 'UPDATE_TRAINING'
export const SET_FILTER = 'SET_FILTER'
export const SET_LOADING = 'SET_LOADING'

const initialState = {
   trainings: [],
   filterBy: {},
   isLoading: false,
}

export function trainingReducer(state = initialState, action) {
   var newState = state
   var trainings
   switch (action.type) {
      case SET_TRAINING:
         newState = { ...state, trainings: action.trainings }
         break
      case REMOVE_TRAINING:
         const lastRemovedTraining = state.trainings.find(
            training => training._id === action.trainingId
         )
         trainings = state.trainings.filter(training => training._id !== action.trainingId)
         newState = { ...state, trainings, lastRemovedTraining }
         break
      case ADD_TRAINING:
         newState = { ...state, trainings: [...state.trainings, action.training] }
         break
      case UPDATE_TRAINING:
         trainings = state.trainings.map(training =>
            training._id === action.training._id ? action.training : training
         )
         newState = { ...state, trainings }
         break
      case SET_FILTER:
         newState = { ...state, filterBy: action.filterBy }
         break
      case SET_LOADING:
         newState = { ...state, isLoading: action.isLoading }
         break
      default:
         state
   }
   return newState
}

// unitTestReducer()

function unitTestReducer() {
   var state = initialState
   const training1 = {
      _id: 'b101',
      title: 'Training ' + parseInt(Math.random() * 10),
      trainings: [],
   }
   const training2 = {
      _id: 'b102',
      title: 'Training ' + parseInt(Math.random() * 10),
      trainings: [],
   }

   state = trainingReducer(state, { type: SET_TRAININGS, trainings: [training1] })
   console.log('After SET_TRAININGS:', state)

   state = trainingReducer(state, { type: ADD_TRAINING, training: training2 })
   console.log('After ADD_TRAINING:', state)

   state = trainingReducer(state, {
      type: UPDATE_TRAINING,
      training: { ...training2, title: 'Good' },
   })
   console.log('After UPDATE_TRAINING:', state)

   state = trainingReducer(state, { type: REMOVE_TRAINING, trainingId: training2._id })
   console.log('After REMOVE_TRAINING:', state)

   const training = { id: 'm' + parseInt(Math.random() * 100), txt: 'Some training' }
   state = trainingReducer(state, { type: ADD_TRAINING_TRAINING, trainingId: training1._id, training })
   console.log('After ADD_TRAINING_TRAINING:', state)

   state = trainingReducer(state, { type: REMOVE_TRAINING, trainingId: training1._id })
   console.log('After REMOVE_TRAINING:', state)
}
