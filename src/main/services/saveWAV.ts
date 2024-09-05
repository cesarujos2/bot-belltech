import axios from 'axios'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'

const saveDir = path.join(app.getPath('desktop'), '/Audios') // Carpeta donde guardar el archivo

if (!fs.existsSync(saveDir)) {
  fs.mkdirSync(saveDir, { recursive: true })
}

export async function downloadWavFile(
  url: string,
  fileName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    })

    const savePath = path.join(saveDir, fileName)

    // Guardar el archivo en la carpeta especificada
    fs.writeFileSync(savePath, response.data)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
