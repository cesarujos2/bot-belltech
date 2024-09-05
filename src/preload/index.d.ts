import { ElectronAPI } from '@electron-toolkit/preload'
import { DBResponse } from '../main/handlers/interactionsHandler'
import { Status } from 'src/main/db/models/interactions'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getUniqueUnreviewedInteraction: () => Promise<DBResponse>
      updateInteractionStatus: (id: string, status: Status) => Promise<DBResponse>
      login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
      saveWAV: (id: string) => Promise<{ success: boolean; error?: string }>
    }
  }
}
