import { storageService } from '../async-storage.service'

const STORAGE_KEY = 'msg'

export const msgService = {
   query,
   getById,
   add,
   update,
   remove,
}
window.cs = msgService

async function query(filterBy = {}) {
   var msgs = await storageService.query(STORAGE_KEY)

   if (!msgs || !msgs.length) {
      msgs = await _createMsgs()
      storageService.saveToStorage(STORAGE_KEY, msgs)
   }
   return msgs
}

async function getById(msgId) {
   const msg = await storageService.get(STORAGE_KEY, msgId)

   return msg
}

async function remove(msgId) {
   await storageService.remove(STORAGE_KEY, msgId)
}

async function add(msg) {
   return await storageService.post(STORAGE_KEY, msg)
}

async function update(msg) {
   return await storageService.put(STORAGE_KEY, msg)
}

async function _createMsgs() {
   return []
}
