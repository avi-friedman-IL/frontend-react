const { VITE_LOCAL } = import.meta.env
import { userService as local } from './user.service.local'
import { userService as remote } from './user.service.remote'
import { getRandomColor } from '../util.service.js'

function getEmptyUser() {
   return {
      username: '',
      password: '',
      fullname: '',
      gender: '',
      isAdmin: false,
      score: 100,
      img: '',
      color: getRandomColor(),
   }
}

const service = VITE_LOCAL ? local : remote
export const userService = { ...service, getEmptyUser }
