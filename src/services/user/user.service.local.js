import { storageService } from '../async-storage.service'

const STORAGE_KEY = 'user'

export const userService = {
   query,
   getById,
   add,
   update,
   remove,
   login,
   signup,
   logout,
   getLoggedinUser,
}

async function query(filterBy = {}) {
   return await storageService.query(STORAGE_KEY)
}

async function getById(chatId) {
   return await storageService.get(STORAGE_KEY, chatId)
}

async function remove(chatId) {
   await storageService.remove(STORAGE_KEY, chatId)
}

async function add(chat) {
   return await storageService.post(STORAGE_KEY, chat)
}

async function update(chat) {
   return await storageService.put(STORAGE_KEY, chat)
}

async function login(user) {
   const users = await storageService.query(STORAGE_KEY)
   const userToLogin = users.find(u => u.username === user.username && u.password === user.password)
   if (!userToLogin) throw new Error('Invalid username or password')
   _saveLoggedinUser(userToLogin)
   return userToLogin
}

async function signup(user) {
   const users = await storageService.query(STORAGE_KEY)
   const userExists = users.find(u => u.username === user.username)
   if (userExists) throw new Error('User already exists')
   user.isAdmin = true
   await storageService.post(STORAGE_KEY, user)
   _saveLoggedinUser(user)
   return user
}

async function logout() {
   sessionStorage.removeItem('loggedinUser')
   return null
}

function getLoggedinUser() {
   return JSON.parse(sessionStorage.getItem('loggedinUser'))
}

function _saveLoggedinUser(user) {
   sessionStorage.setItem('loggedinUser', JSON.stringify(user))
}
