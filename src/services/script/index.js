const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

// import {scriptService as local} from './script.service.local'
import { scriptService as remote } from './script.service.remote'

function getEmptyScript() {
   return {
      category: '',
      title: '',
      items: [
         {
            title: 'opening',
            id: makeId(),
            content: '',
         },
         {
            title: 'connection',
            id: makeId(),
            content: '',
         },
         {
            title: 'reality',
            id: makeId(),
            content: '',
         },
         {
            title: 'solution',
            id: makeId(),
            content: '',
         },
         {
            title: 'closing',
            id: makeId(),
            content: '',
         },
      ],
   }
}

// const service = VITE_LOCAL === 'true' ? local : remote
// const service = local
const service = remote
// console.log(VITE_LOCAL)
export const scriptService = { ...service, getEmptyScript }
