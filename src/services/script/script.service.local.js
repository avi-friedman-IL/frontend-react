
import { storageService } from '../async-storage.service'
import scriptData from '../../data/script'

const STORAGE_KEY = 'script'

export const scriptService = {
   query,
   getById,
   add,
   update,
   remove,
}

async function query(filterBy = {}) {
   var scripts = await storageService.query(STORAGE_KEY)
   if (!scripts || scripts.length === 0) scripts = _getScripts()
   return scripts
}

async function getById(chatId) {
   return await storageService.get(STORAGE_KEY, chatId)
}

async function remove(chatId) {
   await storageService.remove(STORAGE_KEY, chatId)
}

async function add(chat) {
   return await storageService.post(STORAGE_KEY, chat)
}

async function update(chat) {
   return await storageService.put(STORAGE_KEY, chat)
}

async function _getScripts() {
   const scripts = scriptData
   await storageService.saveToStorage(STORAGE_KEY, scripts)
   return scripts
}
