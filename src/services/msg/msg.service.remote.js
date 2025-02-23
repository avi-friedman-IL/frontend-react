import { httpService } from '../http.service'
export const msgService = {
  query,
  getById,
  save,
  remove,
}
const CLOUD_KEY = '929267318661154'
const CLOUD_SECRET = 'F488b_zzRLS3Sh2Efrfr-8_oHLI'

async function query(filterBy = {}) {
  return httpService.get(`msg`, filterBy)
}

function getById(msgId) {
  return httpService.get(`msg/${msgId}`)
}

async function remove(msgId) {
  return httpService.delete(`msg/${msgId}`)
}
async function save(msg) {
  var savedMsg
  if (msg._id) {
    savedMsg = await httpService.put(`msg/${msg._id}`, msg)
  } else {
    savedMsg = await httpService.post('msg', msg)
  }
  return savedMsg
}
