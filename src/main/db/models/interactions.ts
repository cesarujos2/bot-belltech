// src/main/models/interactionsModel.ts
import db from '../connection' // Importa tu módulo de conexión a la base de datos

export type Status = -1 | 0 | 1 | 2 //Error | Unreviewed | Done | Progress

// Define la interfaz para los datos de interacción
export interface Interaction {
  id: string
  status: Status
  description: string
  lastModifiedDate: string
}

// Crea una función para insertar una nueva interacción
export function insertInteraction(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO interactions (id, status, description, lastModifiedDate) VALUES (?, ?, ?, ?)'
    db.run(sql, [id, 0, ''], function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// Crea una función para obtener todas las interacciones
export function getAllInteractions(): Promise<Interaction[]> {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM interactions'
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows as Interaction[])
      }
    })
  })
}

// Crea una función para obtener una interacción por ID
export function getInteractionById(id: string): Promise<Interaction | null> {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM interactions WHERE id = ?'
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row as Interaction | null)
      }
    })
  })
}

// Crea una función para actualizar el estado de una interacción
export function updateInteractionStatus(
  id: string,
  status: number,
  description: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE interactions SET status = ?, description = ?, lastModifiedDate = ? WHERE id = ?';
    const date = new Date().toISOString()
    db.run(sql, [status, description, date, id], function (err) {
      if (err) {
        console.error('Error executing SQL:', err.message);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


export function getUniqueUnreviewedInteraction(): Promise<Interaction | null> {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM interactions WHERE status = 0 LIMIT 1'
    db.get(sql, [], (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row as Interaction | null)
      }
    })
  })
}
