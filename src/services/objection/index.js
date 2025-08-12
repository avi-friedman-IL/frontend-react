const { VITE_LOCAL } = import.meta.env

import { objectionService as local } from './objection.service.local'
import { objectionService as remote } from './objection.service.remote'

function getEmptyObjection() {
   return {
      category: '',
      items: [],
   }
}

const service = VITE_LOCAL ? local : remote
export const objectionService = { ...service, getEmptyObjection }
