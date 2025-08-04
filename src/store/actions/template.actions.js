import { templateService } from '../../services/template'
import { store } from '../store'
import {
   ADD_TEMPLATE,
   REMOVE_TEMPLATE,
   SET_TEMPLATE,
   UPDATE_TEMPLATE,
   SET_FILTER,
   SET_LOADING,
} from '../reducers/template.reducer'

export async function loadTemplates(filterBy = {}) {
   store.dispatch({ type: SET_LOADING, isLoading: true })
   try {
      const templates = await templateService.query(filterBy)
      store.dispatch(getCmdSetTemplate(templates))
      return templates
   } catch (err) {
      console.log('Cannot load templates', err)
      throw err
   } finally {
      store.dispatch({ type: SET_LOADING, isLoading: false })
   }
}

export async function removeTemplate(templateId) {
   try {
      await templateService.remove(templateId)
      store.dispatch(getCmdRemoveTemplate(templateId))
   } catch (err) {
      console.log('Cannot remove template', err)
      throw err
   }
}

export async function addTemplate(template) {
   store.dispatch({ type: SET_LOADING, isLoading: true })
   try {
      const savedTemplate = await templateService.add(template)
      store.dispatch(getCmdAddTemplate(savedTemplate))
      return savedTemplate
   } catch (err) {
      console.log('Cannot add template', err)
      throw err
   } finally {
      store.dispatch({ type: SET_LOADING, isLoading: false })
   }
}

export async function updateTemplate(template) {
   try {
      const savedTemplate = await templateService.update(template)
      store.dispatch(getCmdUpdateTemplate(savedTemplate))
   } catch (err) {
      console.log('Cannot save template', err)
      throw err
   }
}

export async function setFilter(filterBy) {
   store.dispatch({ type: SET_FILTER, filterBy })
}

// Command Creators:
function getCmdSetTemplate(templates) {
   return {
      type: SET_TEMPLATE,
      templates,
   }
}
function getCmdRemoveTemplate(templateId) {
   return {
      type: REMOVE_TEMPLATE,
      templateId,
   }
}
function getCmdAddTemplate(template) {
   return {
      type: ADD_TEMPLATE,
      template,
   }
}
function getCmdUpdateTemplate(template) {
   return {
      type: UPDATE_TEMPLATE,
      template,
   }
}
