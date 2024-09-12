import { ipcMain } from 'electron'
import { AvayaServices } from '../services/avaya'
import { downloadWavFile } from '../services/saveWAV'

export const avaya = new AvayaServices(import.meta.env.MAIN_VITE_URL)

export function avayaHandler() {
  return [
    function login() {
      ipcMain.handle('login', async (_event, username, password) => {
        return await avaya.login(username, password)
      })
    },
    function saveWAV() {
      ipcMain.handle('save-wav', async (_event, id) => {
        try {
          const { success, audioUrl, error, fileName } = await avaya.getAudioUrl(id)
          if (success && audioUrl) {
            const response = await downloadWavFile(audioUrl, `${fileName}`)
            return response
          } else {
            return { success: false, error: error ?? 'Datos del ID correctos - No presenta URL' }
          }
        } catch (err: any) {
          return { success: false, error: err.message }
        }
      })
    }
  ]
}
