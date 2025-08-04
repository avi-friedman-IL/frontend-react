import { httpService } from "../http.service"

export const objectionService = {
    query,
    getById,
    add,
    update,
    remove,

}

async function query(filterBy = {}) {
    return httpService.get(`objection`, filterBy)
}

function getById(objectionId) {
    return httpService.get(`objection/${objectionId}`)
}

async function remove(objectionId) {
    return httpService.delete(`objection/${objectionId}`)
}

async function add(objection) {
    return await httpService.post('objection', objection)
}

async function update(objection) {
    return await httpService.put(`objection/${objection._id}`, objection)
}