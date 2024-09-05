// src/main/ipc/insertInteractionHandle.ts
import { ipcMain } from 'electron' // Asegúrate de que la ruta sea correcta
import { getUniqueUnreviewedInteraction, Interaction, updateInteractionStatus } from '../db/models/interactions'

export function InteractionsHandler() {
  return [
    function getUniqueUnreviewedInteractionHandler() {
      ipcMain.handle('unique-unreviewed-interaction', async (_event) => {
        try {
          const interaction = await getUniqueUnreviewedInteraction()
          return { success: true, data: [interaction] } as DBResponse
        } catch (error: any) {
          return { success: false, error: error.message } as DBResponse
        }
      })
    },
    function updateInteractionStatusHandler(){
      ipcMain.handle('update-interaction-status', async (_event, interactionId, status, description) =>{
        try{
          await updateInteractionStatus(interactionId, status, description)
          return { succes: true }
        } catch(error: any){
          return { succes: false, error: error.message}
        }
      })
    }
  ]
}

export interface DBResponse {
  success: boolean
  error?: string
  data?: Interaction[]
}
