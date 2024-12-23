const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

import { chatService as local } from './chat.service.local'
import { chatService as remote } from './chat.service.remote'

const service = VITE_LOCAL === 'true' ? local : remote
// const service = local 
// console.log(VITE_LOCAL)
export const chatService = { ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

// if (DEV) window.chatService = chatService
