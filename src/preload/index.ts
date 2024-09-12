import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  async getUniqueUnreviewedInteraction() {
    return await ipcRenderer.invoke('unique-unreviewed-interaction')
  },
  async saveWAV(id: string) {
    return await ipcRenderer.invoke('save-wav', id)
  },
  async login(username: string, password: string) {
    return await ipcRenderer.invoke('login', username, password)
  },
  async updateInteractionStatus(id: string, status: number, description: string) {
    return await ipcRenderer.invoke('update-interaction-status', id, status, description)
  },
  async auth(password: string) {
    return await ipcRenderer.invoke('launch', password)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
