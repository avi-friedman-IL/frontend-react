import { httpService } from '../http.service'
export const chatService = {
  query,
  getById,
  save,
  remove,
}
const CLOUD_KEY = '929267318661154'
const CLOUD_SECRET = 'F488b_zzRLS3Sh2Efrfr-8_oHLI'

async function query(filterBy = {}) {
  return httpService.get(`chat`, filterBy)
}

function getById(chatId) {
  return httpService.get(`chat/${chatId}`)
}

async function remove(chatId) {
  return httpService.delete(`chat/${chatId}`)
}
async function save(chat) {
  var savedChat
  if (chat._id) {
    savedChat = await httpService.put(`chat/${chat._id}`, chat)
  } else {
    savedChat = await httpService.post('chat', chat)
  }
  return savedChat
}
