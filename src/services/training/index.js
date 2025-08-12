const { VITE_LOCAL } = import.meta.env

import { trainingService as local } from './training.service.local'
import { trainingService as remote } from './training.service.remote'

const service = VITE_LOCAL ? local : remote
export const trainingService = { ...service }