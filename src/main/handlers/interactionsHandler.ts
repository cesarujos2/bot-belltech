// src/main/ipc/insertInteractionHandle.ts
import { ipcMain } from 'electron' // Asegúrate de que la ruta sea correcta
import { getUniqueUnreviewedInteraction, Interaction, updateInteractionStatus } from '../db/models/interactions'
import { logErrorToFile } from '../services/logErrorToFile'

export function InteractionsHandler() {
  return [
    function getUniqueUnreviewedInteractionHandler() {
      ipcMain.handle('unique-unreviewed-interaction', async (_event) => {
        try {
          const interaction = await getUniqueUnreviewedInteraction()
          if(interaction && interaction.id){
            await updateInteractionStatus(interaction.id, 2, "")
          } else{
            throw new Error("No existen id disposibles!")
          }
          return { success: true, data: [interaction] } as DBResponse
        } catch (error: any) {
          logErrorToFile(error.message ?? "Error desconocido")
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
          logErrorToFile(error.message ?? "Error desconocido")
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
