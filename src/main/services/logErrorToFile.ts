import { app } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'

async function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath)
  try {
    await fs.mkdir(dirname, { recursive: true })
  } catch (err) {
    console.error('Error al crear la carpeta:', err)
  }
}

export async function logErrorToFile(errorMessage: string) {
  const appDataPath = app.getPath('userData')
  const logFilePath = path.join(appDataPath, 'log.txt')

  await ensureDirectoryExistence(logFilePath)

  const timeStamp = new Date().toISOString()
  const logMessage = `[${timeStamp}] Error: ${errorMessage}\n`

  try {
    await fs.appendFile(logFilePath, logMessage)
    console.log('Error registrado en el archivo log.')
  } catch (err) {
    console.error('No se pudo escribir en el archivo log:', err)
  }
}
