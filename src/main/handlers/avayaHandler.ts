import { ipcMain } from 'electron'
import { AvayaServices } from '../services/avaya'
import { downloadWavFile } from '../services/saveWAV'
import { logErrorToFile } from '../services/logErrorToFile'

export const avaya = new AvayaServices(import.meta.env.MAIN_VITE_URL)

export function avayaHandler() {
  return [
    function login() {
      ipcMain.handle('login', async (_event, username, password) => {
        const response = await avaya.login(username, password)
        if(!response.success) logErrorToFile(response.error ?? "AVAYA HANDLER: Error desconocido")
        return response 
      })
    },
    function saveWAV() {
      ipcMain.handle('save-wav', async (_event, id) => {
        try {
          const { success, audioUrl, error, fileName } = await avaya.getAudioUrl(id)
          if (success && audioUrl) {
            const response = await downloadWavFile(audioUrl, `${fileName}`)
            if(!response.success) logErrorToFile(response.error ?? "AVAYA HANDLER: Obtención de audio Correcto") 
            return response
          } else {
            logErrorToFile(error ?? "AVAYA HANDLER: Datos del ID correctos - No presenta URL para descarga")
            return { success: false, error: error ?? 'AVAYA HANDLER: Datos del ID correctos - No presenta URL' }
          }
        } catch (err: any) {
          logErrorToFile(err ?? "")
          return { success: false, error: "AVAYA HANDLER: " + err.message }
        }
      })
    }
  ]
}
