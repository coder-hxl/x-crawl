import { loadEnvFile } from 'node:process'
import { pathResolve } from './utils'

loadEnvFile(pathResolve('../.env'))

export const { BASE_URL, API_KEY } = process.env
