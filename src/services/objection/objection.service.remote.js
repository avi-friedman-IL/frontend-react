import { httpService } from "../http.service"

export const objectionService = {
    query,
    getById,
    save,
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

async function save(objection) {
    var savedObjection
    if (objection._id) {
        savedObjection = await httpService.put(`objection/${objection._id}`, objection)
    } else {
        savedObjection = await httpService.post('objection', objection)
    }
    return savedObjection
}