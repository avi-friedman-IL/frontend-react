
import { storageService } from '../async-storage.service'
import templateData from '../../data/template.json'

const STORAGE_KEY = 'template'

export const templateService = {
   query,
   getById,
   add,
   update,
   remove,
}

async function query(filterBy = {}) {
   var templates = await storageService.query(STORAGE_KEY)
   if (!templates || templates.length === 0) templates = _getTemplates()
   return templates
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

async function _getTemplates() {
   const templates = templateData
   await storageService.saveToStorage(STORAGE_KEY, templates)
   return templates
}