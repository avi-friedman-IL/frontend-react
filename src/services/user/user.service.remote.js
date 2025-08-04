import { httpService } from '../http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
   login,
   logout,
   signup,
   query,
   getById,
   add,
   remove,
   update,
   getLoggedinUser,
   saveLoggedinUser,
}

export async function query(filterBy = {}) {
   return httpService.get(`user`, filterBy)
}

async function getById(userId) {
   const user = await httpService.get(`user/${userId}`)
   return user
}

async function add(user) {
   return httpService.post(`user`, user)
}

function remove(userId) {
   return httpService.delete(`user/${userId}`)
}

async function update(user) {
   const updatedUser = await httpService.put(`user/${user._id}`, user)

   const loggedinUser = getLoggedinUser()
   if (loggedinUser._id === updatedUser._id) saveLoggedinUser(updatedUser)

   return updatedUser
}

async function login(userCred) {
   const user = await httpService.post('auth/login', userCred)
   if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
   const user = await httpService.post('auth/signup', userCred)
   return saveLoggedinUser(user)
}

async function logout() {
   sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
   return await httpService.post('auth/logout')
}

function getLoggedinUser() {
   const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
   return user
}

function saveLoggedinUser(user) {
   sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
   return user
}
