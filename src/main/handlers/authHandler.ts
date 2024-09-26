import { ipcMain } from "electron"
import { auth } from "../Auth/auth"
import { logErrorToFile } from "../services/logErrorToFile"

export const authHandler = () => {
    ipcMain.handle('launch', (_event, password) => {
        const response = auth(password)
        if(!response) logErrorToFile("Contraseña incorrecta.")
        return response
    })
}