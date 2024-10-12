import { app } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'
import { transporter } from './sendEmail'
import os from 'os'

async function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath)
  try {
    await fs.mkdir(dirname, { recursive: true })
  } catch (err) {
    console.error('Error al crear la carpeta:', err)
  }
}

let errorCount: number = 0
let firstErrorTime: null | number = null
const listErrors: Array<string> = []

export async function logErrorToFile(errorMessage: string) {
  const appDataPath = app.getPath('userData')
  const logFilePath = path.join(appDataPath, 'log.txt')

  await ensureDirectoryExistence(logFilePath)

  const timeStamp = new Date().toISOString()
  const logMessage = `[${timeStamp}] Error: ${errorMessage}\n`

  try {
    await fs.appendFile(logFilePath, logMessage)
    console.log('Error registrado en el archivo log.')

    const now = Date.now()

    if (!firstErrorTime) {
      firstErrorTime = now
    }

    if (now - firstErrorTime > import.meta.env.MAIN_VITE_TIMEERRORESSEND * 60 * 1000) {
      errorCount = 1
      firstErrorTime = now
      listErrors.length = 0
    } else {
      errorCount++
      listErrors.push(errorMessage)
    }

    if (errorCount >= import.meta.env.MAIN_VITE_ERRORCOUNTSEND) {
      const response = await transporter.sendEmail(
        import.meta.env.MAIN_VITE_EMAILRECEP,
        'ERROR EN EL SERVIDOR ' + getPrivateIP(),
        'Se han generado errores consecutivos: ',
        listErrors
      )
      if (!response.success) logErrorToFile('El mensaje no se ha podido enviar al correo electrónico')
      errorCount = 0
    }
  } catch (err) {
    console.error('No se pudo escribir en el archivo log:', err)
  }
}

const getPrivateIP = (): null | string => {
  const interfaces = os.networkInterfaces()
  for (const iface of Object.values(interfaces)) {
    if (iface) {
      for (const alias of iface) {
        if (alias.family === 'IPv4' && !alias.internal) {
          return alias.address as string
        }
      }
    }
  }

  return null
}
