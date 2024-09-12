import { ipcMain } from "electron"
import { auth } from "../Auth/auth"

export const authHandler = () => {
    ipcMain.handle('launch', (_event, password) => {
        return auth(password)
    })
}