import { httpService } from '../http.service'
export const templateService = {
  query,
  getById,
  save,
  remove,
}
const CLOUD_KEY = '929267318661154'
const CLOUD_SECRET = 'F488b_zzRLS3Sh2Efrfr-8_oHLI'

async function query(filterBy = {}) {
  if (filterBy.isAdmin) {
    return httpService.get(`template`, filterBy)
  }
  
  const userFilter = {
    ...filterBy,
    userId: filterBy.userId
  }
  return httpService.get(`template`, userFilter)
}

function getById(templateId) {
  return httpService.get(`template/${templateId}`)
}

async function remove(templateId) {
  return httpService.delete(`template/${templateId}`)
}
async function save(template) {
  var savedTemplate
  if (template._id) {
    savedTemplate = await httpService.put(`template/${template._id}`, template)
  } else {
    savedTemplate = await httpService.post('template', template)
  }
  return savedTemplate
}
