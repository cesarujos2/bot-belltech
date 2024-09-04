import sqlite3 from 'sqlite3';
import { app } from 'electron';
import path from 'path';

sqlite3.verbose();

// Configura la ruta de la base de datos
const dbPath = path.resolve(app.getPath('userData'), 'database.db');

// Crea o abre la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        createTableIfNotExists();
    }
});

// Función para crear la tabla si no existe
function createTableIfNotExists() {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS my_table (
            id TEXT PRIMARY KEY,
            status INTEGER
        )
    `;
    
    db.run(createTableSQL, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message);
        } else {
            console.log('Tabla creada o ya existe.');
        }
    });
}

// Exporta la conexión a la base de datos
export default db;

// Cierra la base de datos al cerrar la aplicación
app.on('before-quit', () => {
    db.close((err) => {
        if (err) {
            console.error('Error al cerrar la base de datos:', err.message);
        } else {
            console.log('Base de datos cerrada.');
        }
    });
});
