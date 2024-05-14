import { fileURLToPath } from 'node:url'

export const pathResolve = (dir: string) =>
  fileURLToPath(new URL(dir, import.meta.url))
