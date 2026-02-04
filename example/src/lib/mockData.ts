import { promises as fs } from 'fs'
import path from 'path'

const mockDataRoot = path.join(process.cwd(), 'mock-data')

const resolveResourcePath = (resource: string, filename?: string) => {
  if (filename) {
    return path.join(mockDataRoot, resource, filename)
  }

  return path.join(mockDataRoot, resource)
}

export const readResourceJson = async <T>(resource: string, id: string) => {
  const filePath = resolveResourcePath(resource, `${id}.json`)
  const contents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(contents) as T
}

export const listResourceJson = async <T>(resource: string) => {
  const dirPath = resolveResourcePath(resource)
  const files = await fs.readdir(dirPath)
  const guidPattern = /^[0-9a-fA-F-]{36}\.json$/
  const jsonFiles = files.filter((file) => guidPattern.test(file))

  const items = await Promise.all(
    jsonFiles.map(async (file) => {
      const contents = await fs.readFile(path.join(dirPath, file), 'utf8')
      return JSON.parse(contents) as T
    })
  )

  return items
}
