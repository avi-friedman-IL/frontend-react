import { scriptService } from '../../services/script'
import { store } from '../store'
import {
   ADD_SCRIPT,
   REMOVE_SCRIPT,
   SET_SCRIPTS,
   UPDATE_SCRIPT,
   SET_FILTER,
} from '../reducers/script.reducer'

export async function loadScripts(filterBy = {}) {
   try {
      const scripts = await scriptService.query(filterBy)
      store.dispatch(getCmdSetScripts(scripts))
      return scripts
   } catch (err) {
      console.log('Cannot load scripts', err)
      throw err
   }
}

export async function getScriptById(scriptId) {
   try {
      const script = await scriptService.getById(scriptId)
      return script
   } catch (err) {
      console.log('Cannot get script', err)
      throw err
   }
}

export async function removeScript(scriptId) {
   try {
      await scriptService.remove(scriptId)
      store.dispatch(getCmdRemoveScript(scriptId))
   } catch (err) {
      console.log('Cannot remove script', err)
      throw err
   }
}

export async function addScript(script) {
   try {
      const savedScript = await scriptService.add(script)
      store.dispatch(getCmdAddScript(savedScript))
      return savedScript
   } catch (err) {
      console.log('Cannot add script', err)
      throw err
   }
}

export async function updateScript(script) {
   try {
      const savedScript = await scriptService.update(script)
      store.dispatch(getCmdUpdateScript(savedScript))
   } catch (err) {
      console.log('Cannot save script', err)
      throw err
   }
}

export function setFilter(filterBy) {
   return { type: SET_FILTER, filterBy }
}

function getCmdSetScripts(scripts) {
   return { type: SET_SCRIPTS, scripts }
}

function getCmdRemoveScript(scriptId) {
   return { type: REMOVE_SCRIPT, scriptId }
}

function getCmdAddScript(script) {
   return { type: ADD_SCRIPT, script }
}

function getCmdUpdateScript(script) {
   return { type: UPDATE_SCRIPT, script }
}
