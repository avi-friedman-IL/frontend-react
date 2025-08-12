const { VITE_LOCAL } = import.meta.env

import { msgService as local } from './msg.service.local'
import { msgService as remote } from './msg.service.remote'

const service = VITE_LOCAL ? local : remote
export const msgService = { ...service }
