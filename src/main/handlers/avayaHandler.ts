import { ipcMain } from 'electron'
import { AvayaServices } from '../services/avaya'
import { downloadWavFile } from '../services/saveWAV'
import { logErrorToFile } from '../services/logErrorToFile'

export const avaya = new AvayaServices(import.meta.env.MAIN_VITE_URL)

export function avayaHandler() {
  return [
    function login() {
      ipcMain.handle('login', async (_event, username, password, baseURL) => {
        avaya.setNewBaseURL(baseURL)
        const response = await avaya.login(username, password)
        if(!response.success) logErrorToFile(response.error ?? "Datos del ID correctos - No presenta URL para descarga")
        return response 
      })
    },
    function saveWAV() {
      ipcMain.handle('save-wav', async (_event, id) => {
        try {
          const { success, audioUrl, error, fileName } = await avaya.getAudioUrl(id)
          if (success && audioUrl) {
            const response = await downloadWavFile(audioUrl, `${fileName}`)
            if(!response.success) logErrorToFile(response.error ?? "Obtención de audio Correcto") 
            return response
          } else {
            logErrorToFile(error ?? "Datos del ID correctos - No presenta URL para descarga")
            return { success: false, error: error ?? 'Datos del ID correctos - No presenta URL' }
          }
        } catch (err: any) {
          logErrorToFile(err ?? "")
          return { success: false, error: err.message }
        }
      })
    }
  ]
}
