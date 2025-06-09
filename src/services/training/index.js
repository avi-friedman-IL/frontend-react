const { DEV, VITE_LOCAL } = import.meta.env

import { userService } from '../user'
import { getRandomIntInclusive, makeId } from '../util.service'

import { trainingService as local } from './training.service.local'
import { trainingService as remote } from './training.service.remote'

function getEmptyTraining() {
   return {
      
   }
}

function getDefaultFilter() {
   return {
      
   }
}



const service = VITE_LOCAL === 'true' ? local : remote
// const service = local
// console.log(VITE_LOCAL)
export const trainingService = {
   ...service,
   getEmptyTraining,
   getDefaultFilter,
}

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

// if (DEV) window.trainingService = trainingService
