import { httpService } from '../http.service'
export const trainingService = {
   query,
   getById,
   save,
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
async function save(training) {
   var savedTraining
   if (training._id) {
      savedTraining = await httpService.put(
         `training/${training._id}`,
         training
      )
   } else {
      savedTraining = await httpService.post('training', training)
   }
   return savedTraining
}
