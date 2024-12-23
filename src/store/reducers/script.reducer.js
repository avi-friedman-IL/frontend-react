export const SET_SCRIPTS = 'SET_SCRIPTS'
export const REMOVE_SCRIPT = 'REMOVE_SCRIPT'
export const ADD_SCRIPT = 'ADD_SCRIPT'
export const UPDATE_SCRIPT = 'UPDATE_SCRIPT'

const initialState = {
   scripts: [],
}

export function scriptReducer(state = initialState, action) {
    var newState = state
    var scripts
    switch (action.type) {
        case SET_SCRIPTS:
            newState = { ...state, scripts: action.scripts }
            break
        case REMOVE_SCRIPT:
            scripts = state.scripts.filter(script => script._id !== action.scriptId)
            newState = { ...state, scripts }
            break
        case ADD_SCRIPT:
            newState = { ...state, scripts: [...state.scripts, action.script] }
            break
        case UPDATE_SCRIPT:
            scripts = state.scripts.map(script =>
                script._id === action.script._id ? action.script : script
            )
            newState = { ...state, scripts }
            break
        default:
            state
    }
    return newState
    }


