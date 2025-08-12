
import { storageService } from '../async-storage.service'
import objectionData from '../../data/objection'

const STORAGE_KEY = 'objection'

export const objectionService = {
   query,
   getById,
   add,
   update,
   remove,
}

async function query(filterBy = {}) {
   var objections = await storageService.query(STORAGE_KEY)
   if (!objections || objections.length === 0) objections = _getObjections()
   return objections
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

async function _getObjections() {
   const objections = objectionData
   await storageService.saveToStorage(STORAGE_KEY, objections)
   return objections
}
