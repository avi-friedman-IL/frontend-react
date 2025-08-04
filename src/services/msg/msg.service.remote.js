import { httpService } from '../http.service'
export const msgService = {
   query,
   getById,
   add,
   update,
   remove,
}

async function query(filterBy = {}) {
   if (filterBy.isAdmin) {
      return httpService.get(`msg`, filterBy)
   }

   const userFilter = {
      ...filterBy,
      userId: filterBy.userId,
   }
   return httpService.get(`msg`, userFilter)
}

function getById(msgId) {
   return httpService.get(`msg/${msgId}`)
}

async function remove(msgId) {
   return httpService.delete(`msg/${msgId}`)
}

async function add(msg) {
   return await httpService.post('msg', msg)
}

async function update(msg) {
   return await httpService.put(`msg/${msg._id}`, msg)
}
