const { VITE_LOCAL } = import.meta.env

import { chatService as local } from './chat.service.local'
import { chatService as remote } from './chat.service.remote'

const service = VITE_LOCAL ? local : remote
export const chatService = { ...service }
