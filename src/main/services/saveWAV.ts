import axios, { AxiosError } from 'axios';
import fs from 'fs';
import path from 'path';

const drive = import.meta.env.MAIN_VITE_DRIVE ?? "R"
const baseDir = drive + ':/'; 

export async function downloadWavFile(
  url: string,
  fileName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const dateMatch = fileName.match(/_(\d{8})_/);
    if (!dateMatch) {
      throw new Error('No se pudo extraer la fecha del nombre del archivo');
    }

    const dateStr = dateMatch[1];
    const year = dateStr.slice(4); 
    const month = dateStr.slice(0, 2);
    const day = dateStr.slice(2, 4); 

    const saveDir = path.join(baseDir, year, month, day);
    
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    const savePath = path.join(saveDir, fileName);
    
    if (fs.existsSync(savePath)) {
      return { success: false, error: 'El archivo ya existe en la ubicación' };
    }

    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });

    fs.writeFileSync(savePath, response.data);
    return { success: true };
    
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { success: false, error: `ERROR - Descarga fallida: ${error.response.status} ${error.response.statusText}` };
      } else if (error.request) {
        return { success: false, error: 'ERROR - No se recibió respuesta del servidor.' };
      } else {
        return { success: false, error: `ERROR - ${error.message}` };
      }
    } else {
      // Otros errores no relacionados con Axios
      return { success: false, error: `ERROR - SAVE WAV - ${error instanceof Error ? error.message : 'Error desconocido'}` };
    }
  }
}
