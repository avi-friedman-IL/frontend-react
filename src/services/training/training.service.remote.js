import { httpService } from '../http.service'
export const trainingService = {
   query,
   getById,
   add,
   update,
   remove,
}

async function query(filterBy = {}) {
   return httpService.get(`training`, filterBy)
}

function getById(trainingId) {
   return httpService.get(`training/${trainingId}`)
}

async function remove(trainingId) {
   return httpService.delete(`training/${trainingId}`)
}

async function add(training) {
   return await httpService.post('training', training)
}

async function update(training) {
   return await httpService.put(`training/${training._id}`, training)
}
