const { VITE_LOCAL } = import.meta.env

import { templateService as local } from './template.service.local'
import { templateService as remote } from './template.service.remote'

const service = VITE_LOCAL ? local : remote
export const templateService = { ...service }
