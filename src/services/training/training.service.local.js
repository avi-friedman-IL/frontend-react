
import { storageService } from '../async-storage.service'

const STORAGE_KEY = 'training'

export const trainingService = {
   query,
   getById,
   add,
   update,
   remove,
}

async function query(filterBy = {}) {
   return await storageService.query(STORAGE_KEY)
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
