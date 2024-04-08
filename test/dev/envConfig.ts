import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'

const pathResolve = (dirPath: string) =>
  fileURLToPath(new URL(dirPath, import.meta.url))

dotenv.config({ path: pathResolve('.env') })

export const { BASE_URL, API_KEY } = process.env
