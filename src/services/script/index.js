const { VITE_LOCAL } = import.meta.env

import { scriptService as local } from './script.service.local'
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

const service = VITE_LOCAL ? local : remote
export const scriptService = { ...service, getEmptyScript }
