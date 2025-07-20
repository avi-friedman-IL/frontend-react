import { httpService } from '../http.service.js'

export const chatService = {
    query,
    getById,
    add,
    update,
    remove,
}

async function query(filterBy = {}) {
    return httpService.get('chat', filterBy)
}

async function getById(chatId) {
    return httpService.get(`chat/${chatId}`)
}

async function add(chat) {
    return httpService.post('chat', chat)
}

async function update(chat) {
    return httpService.put(`chat/${chat._id}`, chat)
}

async function remove(chatId) {
    return httpService.delete(`chat/${chatId}`)
}


