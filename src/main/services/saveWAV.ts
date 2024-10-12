import axios, { AxiosError } from 'axios';
import fs from 'fs/promises'; // Usamos fs.promises
import path from 'path';

export const configDir = {
  baseDir: 'R:/'
};

export async function downloadWavFile(
  url: string,
  fileName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const dateMatch = fileName.match(/_(\d{8})_/);
    if (!dateMatch) {
      throw new Error('SAVE WAV - No se pudo extraer la fecha del nombre del archivo');
    }

    const dateStr = dateMatch[1];
    const year = dateStr.slice(4); 
    const month = dateStr.slice(0, 2);
    const day = dateStr.slice(2, 4); 

    const saveDir = path.join(configDir.baseDir, year, month, day);
    
    try {
      await fs.mkdir(saveDir, { recursive: true });
    } catch (mkdirError: any) {
      return { success: false, error: `SAVE WAV - Error al crear el directorio: ${mkdirError.message}` };
    }

    const savePath = path.join(saveDir, fileName);

    try {
      await fs.access(savePath);
      return { success: true, error: 'SAVE WAV - El archivo ya existe en la ubicación' };
    } catch {
      // Si no existe, continúa con la descarga y guardado
    }

    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });

    await fs.writeFile(savePath, response.data);
    return { success: true };
    
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { success: false, error: `SERVICES AVAYA - Descarga fallida: ${error.response.status} ${error.response.statusText} - AUDIO: ¨${url}` };
      } else if (error.request) {
        return { success: false, error: 'SERVICES AVAYA - No se recibió respuesta del servidor.' };
      } else {
        return { success: false, error: `SERVICES AVAYA - ${error.message}` };
      }
    } else {
      return { success: false, error: `ERROR SAVE WAV - ${error instanceof Error ? error.message : 'Error desconocido'}` };
    }
  }
}
