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
        const { audioUrl } = await avaya.getAudioUrl(id)
        if (audioUrl) {
          const response = await downloadWavFile(audioUrl, `${id}.wav`)
          return response
        } else {
          return { success: false, error: 'audioUrl no disponible en la respuesta' }
        }
      })
    }
  ]
}
