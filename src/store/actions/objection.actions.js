import { objectionService } from '../../services/objection'
import { store } from '../store'
import {
   ADD_OBJECTION,
   REMOVE_OBJECTION,
   SET_OBJECTIONS,
   UPDATE_OBJECTION,
} from '../reducers/objection.reducer'

export async function loadObjections(filterBy = {}) {
   try {
      const objections = await objectionService.query(filterBy)
      store.dispatch(getCmdSetObjections(objections))
      return objections
   } catch (err) {
      console.log('Cannot load objections', err)
      throw err
   }
}

export async function getObjectionById(objectionId) {
   try {
      const objection = await objectionService.getById(objectionId)
      return objection
   } catch (err) {
      console.log('Cannot get objection', err)
      throw err
   }
}

export async function removeObjection(objectionId) {
   try {
      await objectionService.remove(objectionId)
      store.dispatch(getCmdRemoveObjection(objectionId))
   } catch (err) {
      console.log('Cannot remove objection', err)
      throw err
   }
}

export async function addObjection(objection) {
   try {
      const savedObjection = await objectionService.add(objection)
      store.dispatch(getCmdAddObjection(savedObjection))
      return savedObjection
   } catch (err) {
      console.log('Cannot add objection', err)
      throw err
   }
}

export async function updateObjection(objection) {
   try {
      const savedObjection = await objectionService.update(objection)
      store.dispatch(getCmdUpdateObjection(savedObjection))
   } catch (err) {
      console.log('Cannot save objection', err)
      throw err
   }
}

function getCmdSetObjections(objections) {
   return { type: SET_OBJECTIONS, objections }
}

function getCmdRemoveObjection(objectionId) {
   return { type: REMOVE_OBJECTION, objectionId }
}

function getCmdAddObjection(objection) {
   return { type: ADD_OBJECTION, objection }
}

function getCmdUpdateObjection(objection) {
   return { type: UPDATE_OBJECTION, objection }
}
