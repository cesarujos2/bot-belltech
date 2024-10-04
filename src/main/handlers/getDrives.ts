import { ipcMain } from 'electron'
import { logErrorToFile } from '../services/logErrorToFile'
import { getDiskInfoSync } from 'node-disk-info'
import { configDir } from '../services/saveWAV'

export const drivesHandler = () => {
  return [
    async function getDrivesList() {
      ipcMain.handle('get-drives', async (_event) => {
        const response = await getDrives()
        if (!response || response.length == 0)
          logErrorToFile('No se pudo cargar los discos montados.')
        return response
      })
    },
    function setDrive() {
      ipcMain.handle('set-drive', (_event, drive) => {
        try {
          configDir.baseDir = drive + "/"
          return { success: true, message: "Disco asignado: " + configDir.baseDir  }
        } catch (error: any) {
          return { success: false, message: error.message }
        }
      })
    }
  ]
}

async function getDrives() {
  try {
    const disks = getDiskInfoSync()
    return disks.map((disk) => disk.mounted)
  } catch (error) {
    console.error('Error obteniendo unidades de disco:', error)
    return []
  }
}
