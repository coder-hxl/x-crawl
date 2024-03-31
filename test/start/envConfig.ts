import path from 'node:path'
import dotenv from 'dotenv'

const pathResolve = (dirPath: string) => path.resolve(__dirname, dirPath)

dotenv.config({ path: pathResolve('.env') })

export const { BASE_URL, API_KEY } = process.env
