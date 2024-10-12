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
            throw new Error("DB HANDLER: No existen id disposibles!")
          }
          return { success: true, data: [interaction] } as DBResponse
        } catch (error: any) {
          logErrorToFile(error.message ?? "DB HANDLER: Error desconocido al obtener status unreviewed")
          return { success: false, error: "DB HANDLER: INTERACTIONS HANDLER" + error.message } as DBResponse
        }
      })
    },
    function updateInteractionStatusHandler(){
      ipcMain.handle('update-interaction-status', async (_event, interactionId, status, description) =>{
        try{
          await updateInteractionStatus(interactionId, status, description)
          return { succes: true }
        } catch(error: any){
          logErrorToFile(error.message ?? "DB HANDLER: Error desconocido al actualizar status")
          return { succes: false, error: "DB HANDLER: " + error.message}
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
