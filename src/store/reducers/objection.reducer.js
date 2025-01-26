export const SET_OBJECTIONS = 'SET_OBJECTIONS'
export const REMOVE_OBJECTION = 'REMOVE_OBJECTION'
export const ADD_OBJECTION = 'ADD_OBJECTION'
export const UPDATE_OBJECTION = 'UPDATE_OBJECTION'

const initialState = {
   objections: [],
}

export function objectionReducer(state = initialState, action) {
    var newState = state
    var objections
    switch (action.type) {
        case SET_OBJECTIONS:
            newState = { ...state, objections: action.objections }
            break
        case REMOVE_OBJECTION:
            objections = state.objections.filter(objection => objection._id !== action.objectionId)
            newState = { ...state, objections }
            break
        case ADD_OBJECTION:
            newState = { ...state, objections: [...state.objections, action.objection] }
            break
        case UPDATE_OBJECTION:
            objections = state.objections.map(objection =>
                objection._id === action.objection._id ? action.objection : objection
            )
            newState = { ...state, objections }
            break
        default:
            state
    }
    return newState
    }


