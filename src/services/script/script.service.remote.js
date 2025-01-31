import { httpService } from "../http.service"

export const scriptService = {
    query,
    getById,
    save,
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

async function save(script) {
    var savedScript
    if (script._id) {
        savedScript = await httpService.put(`script/${script._id}`, script)
    } else {
        savedScript = await httpService.post('script', script)
    }
    return savedScript
}