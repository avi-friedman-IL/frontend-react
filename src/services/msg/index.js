const { DEV, VITE_LOCAL } = import.meta.env

import { userService } from '../user'
import { getRandomIntInclusive, makeId } from '../util.service'

import { msgService as local } from './msg.service.local'
import { msgService as remote } from './msg.service.remote'

function getEmptyMsg() {
  return {
    to: '',
    from: userService.getLoggedinUser()._id,
    subject: '',
    content: '',
    isDone: false,
    createdAt: '',
    responses: [],
  }
}

function getDefaultFilter() {
    return {
      text: '',
      subject:'',
      
    }
}

function getSubjects() {
    return [
      'urgent',
      'personal',
      'general',
    ]
}

const service = VITE_LOCAL === 'true' ? local : remote
// const service = local 
// console.log(VITE_LOCAL)
export const msgService = { ...service, getEmptyMsg, getDefaultFilter, getSubjects }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

// if (DEV) window.msgService = msgService
