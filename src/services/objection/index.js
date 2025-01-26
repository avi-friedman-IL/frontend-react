const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

// import {objectionService as local} from './objection.service.local'
import { objectionService as remote } from './objection.service.remote'

function getEmptyObjection() {
   return {
      category: '',
      items: [],
   }
}

// const service = VITE_LOCAL === 'true' ? local : remote
// const service = local
const service = remote
// console.log(VITE_LOCAL)
export const objectionService = { ...service, getEmptyObjection }
