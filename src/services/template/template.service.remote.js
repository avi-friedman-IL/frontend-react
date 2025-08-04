import { httpService } from '../http.service'
export const templateService = {
   query,
   getById,
   add,
   update,
   remove,
}

async function query(filterBy = {}) {
   if (filterBy.isAdmin) {
      return httpService.get(`template`, filterBy)
   }

   const userFilter = {
      ...filterBy,
      userId: filterBy.userId,
   }
   return httpService.get(`template`, userFilter)
}

function getById(templateId) {
   return httpService.get(`template/${templateId}`)
}

async function remove(templateId) {
   return httpService.delete(`template/${templateId}`)
}

async function add(template) {
   return await httpService.post('template', template)
}

async function update(template) {
   return await httpService.put(`template/${template._id}`, template)
}
