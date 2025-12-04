import { sql, connectDB } from '../config/db.js';

// Estructura de la tabla AreaDeObstetricia:
// AreaDeObstetriciaID int (PK)
// nombre varchar
// PuestoDeSaludID int (FK)

// Obtener todas las áreas
export async function getAllAreas() {
  await connectDB();
  const result = await sql.query`SELECT AreaDeObstetriciaID, nombre as nombre_area FROM AreaDeObstetricia ORDER BY nombre`;
  return result.recordset;
}

// Obtener un área por ID
export async function getAreaById(AreaDeObstetriciaID) {
  await connectDB();
  const result = await sql.query`SELECT AreaDeObstetriciaID, nombre as nombre_area FROM AreaDeObstetricia WHERE AreaDeObstetriciaID = ${AreaDeObstetriciaID}`;
  return result.recordset[0];
}

// Crear una nueva área
export async function createArea(area) {
  await connectDB();
  const { nombre } = area;
  const result = await sql.query`
    INSERT INTO AreaDeObstetricia (nombre)
    VALUES (${nombre});
    SELECT SCOPE_IDENTITY() AS AreaDeObstetriciaID;
  `;
  return result.recordset[0].AreaDeObstetriciaID;
}

// Actualizar un área
export async function updateArea(AreaDeObstetriciaID, area) {
  await connectDB();
  const { nombre } = area;
  await sql.query`
    UPDATE AreaDeObstetricia SET
      nombre = ${nombre}
    WHERE AreaDeObstetriciaID = ${AreaDeObstetriciaID}
  `;
}

// Eliminar un área
export async function deleteArea(AreaDeObstetriciaID) {
  await connectDB();
  await sql.query`DELETE FROM AreaDeObstetricia WHERE AreaDeObstetriciaID = ${AreaDeObstetriciaID}`;
}
