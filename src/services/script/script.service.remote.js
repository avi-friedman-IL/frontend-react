import { httpService } from "../http.service"

export const scriptService = {
    query,
    getById,
    add,
    update,
    remove,

}

async function query(filterBy = {}) {
    return httpService.get(`script`, filterBy)
}

function getById(scriptId) {
    return httpService.get(`script/${scriptId}`)
}

async function remove(scriptId) {
    return httpService.delete(`script/${scriptId}`)
}

async function add(script) {
    return await httpService.post('script', script)
}

async function update(script) {
    return await httpService.put(`script/${script._id}`, script)
}