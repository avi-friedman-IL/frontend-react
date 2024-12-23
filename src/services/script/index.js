const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

// import {scriptService as local} from './script.service.local'
import { scriptService as remote } from './script.service.remote'

function getEmptyScript() {
   return {
      category: '',
      items: [],
   }
}

// const service = VITE_LOCAL === 'true' ? local : remote
// const service = local
const service = remote
// console.log(VITE_LOCAL)
export const scriptService = { ...service, getEmptyScript }
