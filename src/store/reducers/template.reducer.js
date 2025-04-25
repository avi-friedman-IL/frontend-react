import { templateService } from "../../services/template"
import { userService } from "../../services/user"

export const SET_TEMPLATE = 'SET_TEMPLATE'
export const REMOVE_TEMPLATE = 'REMOVE_TEMPLATE'
export const ADD_TEMPLATE = 'ADD_TEMPLATE'
export const UPDATE_TEMPLATE = 'UPDATE_TEMPLATE'
export const SET_FILTER = 'SET_FILTER'
export const SET_LOADING = 'SET_LOADING'
export const SET_ALL_TEMPLATES = 'SET_ALL_TEMPLATES'

const initialState = {
   templates: [],
   allTemplates: [],
   filterBy: {
      txt: '',
      userId: null,
      isAdmin: false
   },
   isLoading: false,
   lastTemplate: null,
}

export function templateReducer(state = initialState, action) {
   var newState = state
   var templates
   switch (action.type) {
      case SET_TEMPLATE:
         newState = { ...state, templates: action.templates }
         break
      case REMOVE_TEMPLATE:
         const lastRemovedTemplate = state.templates.find(
            template => template._id === action.templateId
         )
         templates = state.templates.filter(template => template._id !== action.templateId)
         newState = { ...state, templates, lastRemovedTemplate }
         break
      case ADD_TEMPLATE:
         newState = { ...state, templates: [...state.templates, action.template] }
         break
      case UPDATE_TEMPLATE:
         templates = state.templates.map(template =>
            template._id === action.template._id ? action.template : template
         )
         newState = { ...state, templates }
         break
      case SET_FILTER:
         newState = { ...state, filterBy: action.filterBy }
         break
      case SET_LOADING:
         newState = { ...state, isLoading: action.isLoading }
         break
      case SET_ALL_TEMPLATES:
         newState = { ...state, allTemplates: action.allTemplates }
         break
      default:
         state
   }
   return newState
}

// unitTestReducer()

function unitTestReducer() {
   var state = initialState
   const template1 = {
      _id: 'b101',
      title: 'Template ' + parseInt(Math.random() * 10),
      templates: [],
   }
   const template2 = {
      _id: 'b102',
      title: 'Template ' + parseInt(Math.random() * 10),
      templates: [],
   }

   state = templateReducer(state, { type: SET_TEMPLATES, templates: [template1] })
   console.log('After SET_TEMPLATES:', state)

   state = templateReducer(state, { type: ADD_TEMPLATE, template: template2 })
   console.log('After ADD_TEMPLATE:', state)

   state = templateReducer(state, {
      type: UPDATE_TEMPLATE,
      template: { ...template2, title: 'Good' },
   })
   console.log('After UPDATE_TEMPLATE:', state)

   state = templateReducer(state, { type: REMOVE_TEMPLATE, templateId: template2._id })
   console.log('After REMOVE_TEMPLATE:', state)

   const template = { id: 'm' + parseInt(Math.random() * 100), txt: 'Some template' }
   state = templateReducer(state, { type: ADD_TEMPLATE_TEMPLATE, templateId: template1._id, template })
   console.log('After ADD_TEMPLATE_TEMPLATE:', state)

   state = templateReducer(state, { type: REMOVE_TEMPLATE, templateId: template1._id })
   console.log('After REMOVE_TEMPLATE:', state)
}
